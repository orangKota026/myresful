export interface UIAdapter
{
    notify(message: string, type?: 'info' | 'error' | 'success' | 'warning'): void;
    showLoading(message?: string): void;
    hideLoading(): void;
}

export const showLoading = async (isBrowser: boolean): Promise<void> =>
{
    if (!isBrowser)
    {
        console.log('[loading] start ......');
        return;
    }

    try
    {
        const m = await import('../ui/loading.js');
        m.showLoading();
    }
    catch (err)
    {
        console.error('[loading] show error:', err);
    }
};

export const hideLoading = async (isBrowser: boolean): Promise<boolean> =>
{
    if (!isBrowser)
    {
        console.log('[loading] end');
        return true;
    }

    try
    {
        const m = await import('../ui/loading.js');

        const result = m.hideLoading();

        const resolved = typeof result === 'boolean' ? result : true;

        return resolved;
    }
    catch (err)
    {
        console.error('[loading] hide error:', err);
        return false;
    }
};

export const notify = (
    isBrowser: boolean,
    message: string,
    type: 'success' | 'info' | 'warning' | 'negative' | 'error' = 'info',
    timeout = 3000,
    position:
        | 'top-right'
        | 'top-center'
        | 'top-left'
        | 'bottom'
        | 'bottom-right'
        | 'bottom-left' = 'top-right'
) =>
{
    if (!isBrowser)
    {
        return console.info(`[notify][${type}] ${message}`)
    }

    import('../ui/notify.js').then((m) =>
        m.default(message, type, timeout, position)
    )
}
