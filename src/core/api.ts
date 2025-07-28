import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { getDefaultBaseUrl, getDefaultLimitPayload } from "../adapter/env";
import { MyApi, MyResfulAPI } from "../types/api";
import { AdapterUI } from "../adapter/ui";
import { UIAdapter } from "../types/ui";
import { AuthAdapter } from "../types/auth";
import { AdapterAuth } from "../adapter/auth";
import { AdapterCompress } from "../adapter/compress";
import { CompressAdapter } from "../types/compress";

let ui: UIAdapter = AdapterUI

function setUIAdapter(adapter: UIAdapter)
{
    ui = adapter
}

let auth: AuthAdapter = AdapterAuth;

function setAuthAdapter(adapter: AuthAdapter)
{
    auth = adapter;
}

let compressed = AdapterCompress

function setCompressAdapter(adapter: Partial<CompressAdapter>)
{
    compressed = {
        ...AdapterCompress,
        ...adapter
    };
}

function checkBaseURL(debug = false): boolean
{
    const baseURL = getDefaultBaseUrl();

    if (!baseURL || !/^https?:\/\//.test(baseURL))
    {
        if (debug) console.error('[myresful] baseURL invalid:', baseURL);
        return false;
    }

    if (debug) console.info('[myresful] baseURL valid:', baseURL);
    return true;
}

const instance = axios.create()

instance.defaults.debug = false
instance.defaults.loading = true
instance.defaults.errorNotification = true
instance.defaults.timeout = 10000
instance.defaults.maxBodyLength = getDefaultLimitPayload()

instance.defaults.paramsSerializer = (params) =>
{
    const encodeAxiosParam = (value: any) =>
    {
        let v = value;

        if (Object.prototype.toString.call(value) === '[object Date]')
        {
            v = value.toISOString();
        }
        else if (typeof value === 'object')
        {
            v = JSON.stringify(value);
        }

        return encodeURIComponent(v);
    };

    return Object.entries(params)
        .filter(([, value]) =>
            value !== undefined &&
            value !== null &&
            (Array.isArray(value) ? value.length > 0 : true)
        )
        .map(([key, value]) =>
        {
            if (Array.isArray(value))
            {
                return value.map((v) => `${key}=${encodeAxiosParam(v)}`).join('&');
            }

            return `${key}=${encodeAxiosParam(value)}`;
        })
        .join('&');
};

instance.interceptors.request.use(async (config) =>
{
    if (config.loading) ui.showLoading?.();

    if (!config.path)
    {
        throw new AxiosError('URL not found', 'ERR_FAILED_PAYLOAD', { ...config });

    }

    if (['post', 'put', 'patch'].includes((config.method || '').toLowerCase()) && config.data)
    {
        try
        {
            const maxSizeMB = config.maxBodyLength ?? getDefaultLimitPayload();
            const maxSizeBytes = maxSizeMB * 1024 * 1024;

            const toMB = (bytes: number, fixed = 1) => (bytes / 1024 / 1024).toFixed(fixed);

            const jsonStr = JSON.stringify(config.data);
            const size = typeof Blob !== 'undefined'
                ? new Blob([jsonStr]).size
                : Buffer.byteLength(jsonStr);

            if (size > maxSizeBytes)
            {
                if (compressed.isUse?.() && !(config.data instanceof FormData))
                {
                    try
                    {
                        const data = compressed.method?.(jsonStr, compressed.useBlob?.(), config.filename)

                        if (!compressed.useBlob?.())
                        {
                            const header: any = {
                                ...config.headers,
                                'Content-Encoding': 'gzip',
                                'Content-Type': 'application/json',
                            }

                            config.headers = header
                        }

                        config.data = data;

                    } catch (error)
                    {
                        throw new AxiosError('Compression failed ', 'ERR_COMPRESSION', { ...config })
                    }
                } else
                {
                    throw new AxiosError(`Request payload is limited  ${toMB(maxSizeBytes, 0)}MB, size ${toMB(size)}MB is too large`, 'ERR_FAILED_PAYLOAD', { ...config });
                }
            }
        } catch (error)
        {
            return Promise.reject(error);
        }
    }

    const serializedPath = await serializePath(config.path, config, config.debug);

    config.url = serializedPath
    config.headers = config.headers ?? getHeaders();
    return config;
});

instance.interceptors.response.use(
    async (response) =>
    {
        const config: AxiosRequestConfig = response.config
        if (config.loading) ui.hideLoading?.();
        return response;
    },
    async (error) =>
    {
        return await errorHandler(error)
    }
);

const errorHandler = async (error: AxiosError | any) =>
{
    const config: AxiosRequestConfig = error.config || {};
    const shouldNotify = config.errorNotification;

    if (config.loading) ui.hideLoading?.();

    if (error?.code === "ERR_INVALID_URL")
    {
        ui.notify?.(error.message, 'info');
        return Promise.reject(error);
    }

    const responseType = error.response?.request?.responseType || config.responseType;
    let errorData = error.response?.data;
    const parseBinaryToJson = async (data: any): Promise<any | null> =>
    {
        try
        {
            if (data instanceof Blob)
            {
                const text = await data.text();
                return JSON.parse(text);
            }

            if (data instanceof ArrayBuffer)
            {
                const text = new TextDecoder().decode(data);
                return JSON.parse(text);
            }

            if (typeof process !== 'undefined' && typeof data?.pipe === 'function')
            {
                return new Promise((resolve, reject) =>
                {
                    let result = '';
                    data.setEncoding('utf8');
                    data.on('data', (chunk: string) => result += chunk);
                    data.on('end', () =>
                    {
                        try
                        {
                            resolve(JSON.parse(result));
                        } catch
                        {
                            resolve(null);
                        }
                    });
                    data.on('error', reject);
                });
            }

            if (typeof DOMParser !== 'undefined' && typeof data === 'string' && responseType === 'document')
            {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "application/xml");
                const errorNode = doc.querySelector("parsererror");
                if (errorNode) return { message: errorNode.textContent };
            }

        } catch (_) { }
        return null;
    };

    if (
        ['blob', 'arraybuffer', 'stream', 'document'].includes(responseType) &&
        errorData
    )
    {
        const parsed = await parseBinaryToJson(errorData);
        if (parsed && typeof parsed === 'object')
        {
            errorData = parsed;
        }
    }

    if (shouldNotify)
    {
        if (errorData && typeof errorData === 'object')
        {
            if (errorData.statusCode === 401) auth.logout?.();

            if (!error.config?._notified)
            {
                const errTitle = errorData?.error;

                if (Array.isArray(errorData.message))
                {
                    errorData.message.forEach((msg: string) =>
                    {
                        ui.notify?.(`${errTitle ? `<b>${errTitle}</b><br>` : ''}${msg}`);
                    });
                } else
                {
                    ui.notify?.(`${errTitle ? `<b>${errTitle}</b><br>` : ''}${errorData.message || error.message || 'An unknown error occurred.'}`);
                }

                error.config._notified = true;
            }

        } else if (error.message === 'Network Error' || error.code === 'ECONNABORTED')
        {
            ui.notify?.('Failed to connect to server. server not reachable');
        } else
        {
            ui.notify?.(error.message || 'An unknown error occurred.');
        }
    }

    if (errorData?.status === 401 || error.status === 401) auth.logout?.();

    return Promise.reject(error);
};

export const getHeaders = (): AxiosHeaders =>
{
    const token = isAuthenticated();

    const headers = new AxiosHeaders();

    if (token)
    {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
};

const isAuthenticated = () => auth.isAuthenticated();

async function serializePath(path: string, config: AxiosRequestConfig | undefined, debug: AxiosRequestConfig['debug'])
{
    try
    {
        if (!path || typeof path !== 'string')
        {
            throw new AxiosError('Path must be a non-empty string', 'ERR_INVALID_URL', { ...config, headers: getHeaders() });
        }

        const rules = [
            path.indexOf("http://") === 0,
            path.indexOf("https://") === 0
        ];

        const isExternalResource = rules.some(el => el);
        const trimmedPath = path.trim();

        const pathRegex = /^[a-zA-Z0-9\-_.:/?#&=]+$/;
        if (!pathRegex.test(trimmedPath))
        {
            throw new AxiosError('Path contains invalid characters: ' + trimmedPath, 'ERR_INVALID_URL', { ...config, headers: getHeaders() });
        }

        const cleanBase = isExternalResource ? path : getDefaultBaseUrl() + path;
        const cleanPath = cleanBase.replace(/^\/+/, '');
        const serializedURL = cleanPath;

        if (debug) console.info('[myresful] Serialized URL:', serializedURL);

        return serializedURL.replace(/([^:]\/)\/+/g, "$1");
    } catch (error)
    {
        if (config)
        {
            return Promise.reject(error)

        } else
        {
            return await errorHandler(error)
        }
    }
}

const method: MyApi = {
    get: <T = any>(config: AxiosRequestConfig) =>
    {
        return instance.request<T>({ ...config, method: 'get' });
    },
    post: <T = any>(config: AxiosRequestConfig) =>
    {
        return instance.request<T>({ ...config, method: 'post' });
    },
    put: <T = any>(config: AxiosRequestConfig) =>
    {
        return instance.request<T>({ ...config, method: 'put' });
    },
    patch: <T = any>(config: AxiosRequestConfig) =>
    {
        return instance.request<T>({ ...config, method: 'patch' });
    },
    remove: <T = any>(config: AxiosRequestConfig) =>
    {
        return instance.request<T>({ ...config, method: 'delete' });
    }
};

const api: MyResfulAPI = {
    setUIAdapter,
    setAuthAdapter,
    setCompressAdapter,
    checkBaseURL,
    serializePath,
    ...method
};

export default api;