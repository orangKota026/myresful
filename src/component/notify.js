const MyNotify = (message, type = 'info', timeout = 3000, position = 'top-right') =>
{
  if (window.innerWidth < 599)
  {
    position = 'top-center';
  }

  if (!document.querySelector('#my-notify'))
  {
    const style = document.createElement('style');
    style.id = 'my-notify';

    let importFonts = "";
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Roboto"]'))
    {
      importFonts += `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`;
    }
    if (!document.querySelector('link[href*="fonts.googleapis.com/icon?family=Material+Icons"]'))
    {
      importFonts += `@import url('https://fonts.googleapis.com/icon?family=Material+Icons');`;
    }

    style.innerHTML = `
      ${importFonts}
      .my-notify-container {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          max-width: 90vw;
          width: fit-content;
      }
      .my-top-center { top: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
      .my-top-right { top: 20px; right: 20px; align-items: flex-end; }
      .my-top-left { top: 20px; left: 20px; align-items: flex-start; }
      .my-bottom-right { bottom: 20px; right: 20px; align-items: flex-end; }
      .my-bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }
      .my-bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
  
      .my-custom-notify {
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
        animation: my-fadeInOut 0.5s ease-out forwards;
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        position: relative;
        overflow: hidden; 
        width: fit-content;        
        min-width: 250px;
        max-width: 80vw;  
        word-break: break-word;
        white-space: normal;
      }
      
      .my-icons {
          font-family: 'Material Icons';
          font-size: 20px;
          color: #fff;
          flex-shrink: 0; 
      }

      .my-notify-message {
          flex: 1;                
          word-wrap: break-word;  
          white-space: normal;
          max-width: 100%;
          padding-right: 10px;
      }
  
      .my-notify-success { background-color: #21BA45; }
      .my-notify-info { background-color: #31CCEC; }
      .my-notify-warning { background-color: #F2C037; }
      .my-notify-negative, .my-notify-error { background-color: #C10015; }
  
      .my-hide {
          animation: my-fadeInOut 0.5s ease-in reverse forwards;
      }
  
      @keyframes my-fadeInOut {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
      }
  
      .my-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.6);
          animation: my-progressBar linear forwards;
      }
  
      @keyframes my-progressBar {
          from { width: 100%; }
          to { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }

  let container = document.querySelector(`.my-notify-container.my-${position}`);
  if (!container)
  {
    container = document.createElement('div');
    container.classList.add('my-notify-container', `my-${position}`);
    document.body.appendChild(container);
  }

  const myIcon = {
    success: 'check_circle',
    info: 'info',
    warning: 'error_outline',
    negative: 'warning',
  };

  const mynotification = document.createElement('div');
  mynotification.classList.add('my-custom-notify', `my-notify-${type}`);
  mynotification.innerHTML = `
      <i class="my-icons material-icons">${myIcon[type] || 'info'}</i>
      <div class="my-notify-message">${message}</div>
      <div class="my-progress-bar" style="animation-duration: ${timeout}ms;"></div>
    `;

  container.appendChild(mynotification);

  setTimeout(() =>
  {
    mynotification.classList.add('my-hide');
    setTimeout(() => mynotification.remove(), 500);
  }, timeout);
};

export default MyNotify;
