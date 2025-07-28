declare function MyNotify(
    message: string,
    type?: 'success' | 'info' | 'warning' | 'negative' | 'error',
    timeout?: number,
    position?:
        | 'top-right'
        | 'top-center'
        | 'top-left'
        | 'bottom'
        | 'bottom-right'
        | 'bottom-left'
): void;

export default MyNotify;
