import { EnvSource } from "../types/env";

export const isBrowser = typeof window !== 'undefined';
export const isNode = typeof globalThis !== 'undefined' && typeof (globalThis as any).process !== 'undefined';

export const env = (isBrowser ? window : globalThis) as unknown as EnvSource;

export const getDefaultBaseUrl = (): string =>
{
    return isNode
        ? (process.env.VITE_APP_API || process.env.API || '')
        : ((isBrowser && (window as any).API_BASE_URL) || '');
};

export const getDefaultLimitPayload = (): number =>
{
    return isNode
        ? Number(process.env.VITE_APP_API_LIMIT || process.env.API_LIMIT || 1)
        : Number(env.API_LIMIT || 1);
}