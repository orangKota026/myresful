import { AxiosRequestConfig, AxiosResponse } from "axios"
import { UIAdapter } from "./ui"
import { AuthAdapter } from "./auth"
import { CompressAdapter } from "./compress"

declare module 'axios' {
    export interface AxiosRequestConfig
    {
        maxSize?: number
        loading?: boolean
        errorNotification?: boolean
        _notified?: boolean
        debug?: boolean
        path?: string
        filename?: string
    }
}

export interface serializePathRequest
{
    use: boolean,
    loading: boolean
}

export interface MyResfulAPI extends MyApi
{
    setUIAdapter: (adapter: UIAdapter) => void;
    setAuthAdapter: (adapter: AuthAdapter) => void;
    setCompressAdapter: (adapter: CompressAdapter) => void;
    checkBaseURL: (debug?: boolean) => boolean;
    serializePath: (path: string, makeRequest: serializePathRequest, debug?: boolean) => Promise<string>;
}

export interface MyApi
{
    get<T = any>(args: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(args: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(args: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(args: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    remove<T = any>(args: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}