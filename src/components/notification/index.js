export const showErrorNotification = (message) =>
{
    const notification = document.getElementById('custom-notification');
    const messageElement = document.getElementById('notification-message');
    if (notification && messageElement)
    {
        messageElement.innerHTML = message;
        notification.style.display = 'block';
        setTimeout(() =>
        {
            notification.style.display = 'none';
        }, 5000);
    }
};