export const showLoading = () =>
{
    const spinner = document.getElementById('custom-loading-spinner');
    if (spinner)
    {
        spinner.style.display = 'flex';
    }
};

export const hideLoading = () =>
{
    const spinner = document.getElementById('custom-loading-spinner');
    if (spinner)
    {
        spinner.style.display = 'none';
    }
};
