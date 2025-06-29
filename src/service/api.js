import axios from 'axios';
import User from "./user.js";
import MyNotify from "../component/notify.js";
import { showLoading, hideLoading } from '../component/loading.js';

/** @typedef {import('../../types').RequestArgs} RequestArgs */
/** @typedef {import('../../types').BaseURLCheckResult} BaseURLCheckResult */
/** @type {import('../../types').CustomWindow} */
const env = window;

const baseURL = (typeof process !== "undefined" && process?.env)
  ? (process.env.VITE_APP_API || process.env.API)
  : (typeof window !== "undefined" && env.API_BASE_URL)
    ? env.API_BASE_URL
    : '';

const api = axios.create({ baseURL });

/**
 * Checks whether baseURL has been defined.
 * @returns {BaseURLCheckResult}
 */
const checkBaseURL = () =>
{
  if (!baseURL || typeof baseURL !== 'string' || baseURL.trim() === '')
  {
    return {
      valid: false,
      baseURL: null,
      message: 'baseURL is empty or not defined. Set via VITE_APP_API, API env, or window.API_BASE_URL.'
    };
  }

  return {
    valid: true,
    baseURL
  };
};

/** @type {import('../../types').SerializePathFn} */
const serializePath = (path) =>
{
  if (!path) return '';

  const rules = [
    path.indexOf("http://") === 0,
    path.indexOf("https://") === 0
  ];
  const isExternalResource = rules.some(el => el);

  const serializedURL = isExternalResource ? path : (baseURL ? baseURL + path : path);
  return serializedURL.replace(/([^:]\/)\/+/g, "$1");
};

/** @type {import('../../types').ParamsSerializerFn} */
api.defaults.paramsSerializer = (params) =>
{
  /**
   * Encodes a parameter value for Axios.
   * @param {any} value
   * @returns {string}
   */
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

/** @type {import('../../types').ErrorHandlerFn} */
const errorHandler = async (error) =>
{
  const config = error.config;
  if (config.loading) hideLoading();

  if (config.errorNotification)
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
          /** @type {string[]} */
          (errorData.message).forEach((msg) =>
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
  return User.isAuthenticated()
}

/** @type {import('../../types').MakeRequestFn} */
const makeRequest = async (method, args) =>
{
  const { path, data, params, responseType, loading } = args;

  const serializedPath = serializePath(path);

  /** @type {import('../../types').ExtendedAxiosRequestConfig} */
  let config = { method, url: serializedPath, data, params }

  if (isAuthenticated()) config = { ...config, headers: getHeaders() }

  if (typeof responseType === 'string' && responseType)
  {
    config = { ...config, responseType };
  }

  if (loading) showLoading();

  try
  {
    const response = await api(config);

    if (loading) hideLoading();

    return response;
  } catch (/** @type {any} */ error)
  {
    if (loading) hideLoading();
    await errorHandler(error);
    return Promise.reject(error);
  }
};

/** @type {import('../../types').RequestMethodFn} */
const post = (args) => makeRequest('post', { ...args, loading: true, errorNotification: true });

/** @type {import('../../types').RequestMethodFn} */
const get = (args) => makeRequest('get', { ...args, loading: true, errorNotification: true });

/** @type {import('../../types').RequestMethodFn} */
const patch = (args) => makeRequest('patch', { ...args, loading: true, errorNotification: true });

/** @type {import('../../types').RequestMethodFn} */
const put = (args) => makeRequest('put', { ...args, loading: true, errorNotification: true });

/** @type {import('../../types').RequestMethodFn} */
const remove = (args) => makeRequest('delete', { ...args, loading: true, errorNotification: true });

api.interceptors.response.use(
  (response) =>
  {
    /** @type {import('../../types').ExtendedAxiosRequestConfig} */
    const config = response.config;

    if (config.loading) hideLoading();
    return response;
  },
  errorHandler
);


export default { serializePath, post, get, patch, put, remove, checkBaseURL };  