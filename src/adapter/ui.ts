import { hideLoading, notify, showLoading, UIAdapter } from '../types/ui';
import { isBrowser, isNode } from './env';

export const AdapterUI: UIAdapter = {
    notify: function (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info'): void
    {
        const prefix = {
            info: '[INFO]',
            error: '[ERROR]',
            success: '[SUCCESS]',
            warning: '[WARNING]',
        }[type];

        if ((isNode && isBrowser) || isBrowser)
        {
            notify(isBrowser, message, 'negative', 3000, 'top-right')
        } else
        {
            console.log(`${prefix} ${message}`);
        }
    },
    showLoading: function (message?: string): void
    {
        if ((isNode && isBrowser) || isBrowser)
        {
            showLoading(isBrowser)
        } else
        {
            console.log(`[LOADING] ${message} ....`);
        }
    },
    hideLoading: async function (): Promise<void>
    {
        if ((isNode && isBrowser) || isBrowser)
        {
            await hideLoading(isBrowser)
        } else
        {
            console.log(`[LOADING DONE]`);
        }
    }
}
