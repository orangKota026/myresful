import axios from 'axios';
import { Notify, Loading, QSpinnerHourglass } from 'quasar';
import User from "./user.js";

const api = axios.create({ baseURL: process.env.VITE_APP_API || process.env.API });

const serializePath = (path) =>
{
  if (!path) return;

  const rules = [
    path.indexOf("http://") === 0,
    path.indexOf("https://") === 0
  ];
  const isExternalResource = rules.some(el => el);

  const serializedURL = isExternalResource ? path : process.env.VITE_APP_API || process.env.API + path;
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

const showLoading = () =>
{
  Loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'white',
    spinnerSize: 100,
    backgroundColor: 'blue-grey-10',
    message: 'Some important process is in progress. Hang on...',
    messageColor: 'white',
  });
};

const hideLoading = () =>
{
  Loading.hide();
};

const errorHandler = async (error) =>
{
  if (error.config?.loading) hideLoading();

  if (error.config?.errorHandler)
  {
    let message = error.message;

    const errorData = error.response?.data;

    if (errorData && typeof errorData === 'object')
    {
      if (errorData.statusCode === 401 && errorData.message === 'Token Expired')
      {
        User.logout();
        return;
      }

      message = '';
      if (errorData?.error) message += `<div class="text-bold">${errorData.error}</div>`;
      if (errorData?.message)
      {
        if (Array.isArray(errorData.message))
        {
          message += errorData.message.map((el) => `<li>${el}</li>`).join('');
        } else
        {
          message += `<div class="text-caption text-white">${errorData?.message}</div>`;
        }
      }
    }

    if (!error.config._notified)
    {
      Notify.create({
        type: 'negative',
        position: 'top-right',
        message: message || error.message,
        html: true,
      });
      error.config._notified = true;
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

const makeRequest = async (method, args) =>
{
  const { path, data, params, responseType, loading } = args;

  const serializedPath = serializePath(path);

  let config = {}

  if (isAuthenticated()) config = { headers: getHeaders() }

  if (loading) showLoading();

  try
  {
    const payload = {
      method,
      url: serializedPath,
      data,
      params,
      responseType,
      ...config,
    }

    const response = await api(payload);

    if (loading) hideLoading();

    return response;
  } catch (error)
  {
    if (loading) hideLoading();
    return errorHandler(error);
  }
};

const post = (args) => makeRequest('post', { ...args, loading: true, errorNotification: true });

const get = (args) => makeRequest('get', { ...args, loading: true, errorNotification: true });

const patch = (args) => makeRequest('patch', { ...args, loading: true, errorNotification: true });

const put = (args) => makeRequest('put', { ...args, loading: true, errorNotification: true });

const remove = (args) => makeRequest('delete', { ...args, loading: true, errorNotification: true });

api.interceptors.response.use(
  (response) =>
  {
    console.log(response);

    if (response.config?.loading) hideLoading();
    return response;
  },
  errorHandler
);

export default { serializePath, post, get, patch, put, remove };
