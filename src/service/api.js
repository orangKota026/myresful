import axios from 'axios';
import User from "./user.js";
import MyNotify from "../component/notify.js";
import { showLoading, hideLoading } from '../component/loading.js';

const baseURL = (typeof process !== "undefined" && process?.env)
  ? (process.env.VITE_APP_API || process.env.API)
  : (typeof window !== "undefined" && window.API_BASE_URL)
    ? window.API_BASE_URL
    : '';

const api = axios.create({ baseURL });

/**
 * Serialize path to ensure there are no double slashes in the URL.
 * @param {string} path - URL or API endpoint.
 * @returns {string} Serialized URL.
 */
const serializePath = (path) =>
{
  if (!path) return;

  const rules = [
    path.indexOf("http://") === 0,
    path.indexOf("https://") === 0
  ];
  const isExternalResource = rules.some(el => el);

  const serializedURL = isExternalResource ? path : baseURL || baseURL + path;
  return serializedURL.replace(/([^:]\/)\/+/g, "$1");
};

api.defaults.loading = true;
api.defaults.errorHandler = true;

api.defaults.paramsSerializer = (params) =>
{
  const encodeAxiosParam = (value) =>
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
        return value.map((v) => `${key}[]=${encodeAxiosParam(v)}`).join('&');
      }

      return `${key}=${encodeAxiosParam(value)}`;
    })
    .join('&');
};

const errorHandler = async (error) =>
{
  if (error.config?.loading) hideLoading();

  if (error.config?.errorHandler)
  {
    const errorData = error.response?.data;

    if (errorData && typeof errorData === 'object')
    {
      if (errorData.statusCode === 401)
      {
        User.logout();
      }

      if (!error.config._notified)
      {
        if (Array.isArray(errorData.message))
        {
          errorData.message.forEach((msg) =>
          {
            MyNotify(
              `${errorData.error ? `<b>${errorData.error}</b><br>` : ''}${msg}`,
              'negative'
            );
          });
        } else
        {
          MyNotify(
            `${errorData.error ? `<b>${errorData.error}</b><br>` : ''}${errorData.message || error.message || 'Terjadi kesalahan'}`,
            'negative'
          );
        }

        error.config._notified = true;
      }
    }
    else if (error.message === "Network Error" || error.code === "ECONNABORTED")
    {
      MyNotify("Failed to connect to server. Check your connection.", "negative");
    }
    else
    {
      MyNotify(error.message || "An unknown error occurred.", "negative");
    }
  }

  return Promise.reject(error);
};

const getHeaders = () =>
{
  return {
    authorization: "Bearer " + isAuthenticated() || null
  };
}

const isAuthenticated = () =>
{
  return localStorage.getItem('access_token');
}

/**
 * @typedef {Object} RequestArgs
 * @property {string} path - URL or API endpoint.
 * @property {Object} [data] - Data sent in the request (for POST, PUT, PATCH).
 * @property {Object} [params] - Query string parameters (for GET, DELETE).
 * @property {XMLHttpRequestResponseType} [responseType] - Type of response expected.
 * @property {boolean} [loading=true] - Whether to display loading or not.
 * @property {boolean} [errorNotification=true] - Whether to display error notification or not.
 */

/**
 * @param {string} path - URL or API endpoint.
 * @param {RequestArgs} args - Request options.
 * @param {'get' | 'post' | 'patch' | 'put' | 'delete'} method - HTTP method.
 * @returns {Promise<import('axios').AxiosResponse>}
 */

const makeRequest = async (method, args) =>
{
  const { path, data, params, responseType, loading } = args;

  const serializedPath = serializePath(path);

  let config = {}

  if (isAuthenticated()) config = { headers: getHeaders() }

  if (loading) showLoading();

  try
  {
    const response = await api({ method, url: serializedPath, data, params, responseType, ...config });

    if (loading) hideLoading();

    return response;
  } catch (error)
  {
    if (loading) hideLoading();
    await errorHandler(error);
    return Promise.reject(error);
  }
};

/**
 * Request POST.
 * @param {RequestArgs} args - Argumen request.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const post = (args) => makeRequest('post', { ...args, loading: true, errorNotification: true });

/**
 * Request GET.
 * @param {RequestArgs} args - Argumen request.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const get = (args) => makeRequest('get', { ...args, loading: true, errorNotification: true });

/**
 * Request PATCH.
 * @param {RequestArgs} args - Argumen request.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const patch = (args) => makeRequest('patch', { ...args, loading: true, errorNotification: true });

/**
 * Request PUT.
 * @param {RequestArgs} args - Argumen request.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const put = (args) => makeRequest('put', { ...args, loading: true, errorNotification: true });

/**
 * Request DELETE.
 * @param {RequestArgs} args - Argumen request.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const remove = (args) => makeRequest('delete', { ...args, loading: true, errorNotification: true });

api.interceptors.response.use(
  (response) =>
  {
    if (response.config?.loading) hideLoading();

    return response;
  },
  errorHandler
);

export default { serializePath, post, get, patch, put, remove };
