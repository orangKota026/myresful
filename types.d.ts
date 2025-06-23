import { AxiosRequestConfig, AxiosResponse, AxiosError, ResponseType } from 'axios';

export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface CustomWindow extends Window
{
    API_BASE_URL?: string;
}

export interface BaseURLCheckResult
{
    valid: boolean;
    baseURL: string | null;
    message?: string;
}

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig
{
    loading?: boolean;
    errorNotification?: boolean;
    _notified?: boolean;
}

export type SerializePathFn = (path: string) => string

export type ParamsSerializerFn = (params: Record<string, any>) => string

export interface APIErrorResponse { statusCode?: number, message?: string | string[], error?: string }
export type ErrorHandlerFn = (error: AxiosError<APIErrorResponse, any> & { config: ExtendedAxiosRequestConfig }) => Promise<never>

export interface RequestArgs
{
    path: string;
    data?: Record<string, any>;
    params?: Record<string, any>;
    responseType?: XMLHttpRequestResponseType;
    loading?: boolean;
    errorNotification?: boolean;
}

export type MakeRequestFn = (method: HTTPMethod, args: RequestArgs) => Promise<AxiosResponse>

export type RequestMethodFn = (args: RequestArgs) => Promise<AxiosResponse>


export interface MyResfulAPI
{
    checkBaseURL(): BaseURLCheckResult
    serializePath: SerializePathFn
    makeRequest: MakeRequestFn

    get: RequestMethodFn
    post: RequestMethodFn
    patch: RequestMethodFn
    put: RequestMethodFn
    remove: RequestMethodFn
}

export interface UserData
{
    id: string;
    name: string;
    email: string;
    role?: string;
    title?: string;
}