import { EnvSource } from "../types/env";

export const isBrowser = typeof window !== 'undefined';
export const isNode = typeof globalThis !== 'undefined' && typeof (globalThis as any).process !== 'undefined';

export const env = (isBrowser ? window : globalThis) as unknown as EnvSource;

let currentBaseUrl: string = isNode
    ? (process.env.VITE_APP_API || process.env.API || '')
    : (env.API_BASE_URL || '');

let limit = isNode
    ? Number(process.env.VITE_APP_API_LIMIT || process.env.API_LIMIT || 1)
    : Number(env.API_LIMIT || 1);

export const getDefaultBaseUrl = (): string =>
{
    return currentBaseUrl;
};

export const getDefaultLimitPayload = (): number =>
{
    return limit
}