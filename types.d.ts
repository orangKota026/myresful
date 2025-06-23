import { AxiosRequestConfig } from 'axios';

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig
{
    loading?: boolean;
    errorHandler?: boolean;
    _notified?: boolean;
}

export interface CustomWindow extends Window
{
    API_BASE_URL?: string;
}

export interface RequestArgs
{
    path: string;
    data?: Record<string, any>;
    params?: Record<string, any>;
    responseType?: XMLHttpRequestResponseType;
    loading?: boolean;
    errorNotification?: boolean;
}

export interface BaseURLCheckResult
{
    valid: boolean;
    baseURL: string | null;
    message?: string;
}

export interface UserData
{
    id: string;
    name: string;
    email: string;
    role?: string;
    title?: string;
}