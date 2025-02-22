const MyNotify = (message, type = 'info', timeout = 3000, position = 'top-right') =>
{
  if (window.innerWidth < 599)
  {
    position = 'bottom-center';
  }

  if (!document.querySelector('#mynotify'))
  {
    const style = document.createElement('style');
    style.id = 'mynotify';

    let importFonts = "";
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Roboto"]'))
    {
      importFonts = `
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        `;
    }

    style.innerHTML = `
        ${importFonts}
        .mynotify-container {
            position: fixed;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            max-width: 90vw;
            width: fit-content;
        }
        .top-right { top: 20px; right: 20px; align-items: flex-end; }
        .top-left { top: 20px; left: 20px; align-items: flex-start; }
        .bottom-right { bottom: 20px; right: 20px; align-items: flex-end; }
        .bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }
        .bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
    
        .custom-mynotify {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        border-radius: 10px;
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        color: #fff;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: scale(0.9);
        animation: fadeInOut 0.5s ease-out forwards;
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        position: relative;
        overflow: hidden; 
        width: fit-content;        
        min-width: 250px;
        max-width: 90vw;  
        word-break: break-word;
        white-space: normal;
        }
        
        .myicons {
            font-size: 20px;
            color: #fff;
            flex-shrink: 0; 
        }
  
        .mynotify-message {
            flex: 1;                
            word-wrap: break-word;  
            white-space: normal;
            max-width: 100%;
            padding-right: 10px;
        }
    
        .mynotify-success { background-color: #21BA45; }
        .mynotify-info { background-color: #31CCEC; }
        .mynotify-warning { background-color: #F2C037; }
        .mynotify-negative, .mynotify-error { background-color: #C10015; }
    
        .hide {
            animation: fadeInOut 0.5s ease-in reverse forwards;
        }
    
        @keyframes fadeInOut {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    
        .progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: rgba(255, 255, 255, 0.6);
            animation: progressBar linear forwards;
        }
    
        @keyframes progressBar {
            from { width: 100%; }
            to { width: 0%; }
        }
      `;
    document.head.appendChild(style);
  }

  let container = document.querySelector(`.mynotify-container.${position}`);
  if (!container)
  {
    container = document.createElement('div');
    container.classList.add('mynotify-container', position);
    document.body.appendChild(container);
  }

  const icons = {
    success: 'check_circle',
    info: 'info',
    warning: 'error_outline',
    negative: 'warning',
  };

  const notification = document.createElement('div');
  notification.classList.add('custom-mynotify', `mynotify-${type}`);
  notification.innerHTML = `
      <span class="myicons">${icons[type] || 'info'}</span>
      <div class="mynotify-message">${message}</div>
      <div class="progress-bar" style="animation-duration: ${timeout}ms;"></div>
    `;

  container.appendChild(notification);

  setTimeout(() =>
  {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 500);
  }, timeout);
};

export default MyNotify;
