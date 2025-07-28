const notifyCache = {};

function MyNotify(message, type = 'info', timeout = 3000, position = 'top-right')
{
  if (window.innerWidth < 599)
  {
    position = 'top-center';
  }

  if (!document.querySelector('#my-notify'))
  {
    const style = document.createElement('style');
    style.id = 'my-notify';

    let importFonts = '';
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
        z-index: 10000;
				pointer-events: none;
				left: 0;
				right: 0;
				position: fixed;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				padding: 10px;
      }
      .my-notify-top-right { top: 20px; right: 20px; align-items: flex-end; }
      .my-notify-bottom { bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
      .my-notify-negative, .my-notify-error { background-color: #C10015; }
      .my-notify-warning { background-color:rgb(158, 128, 46); }
      .my-notify {
        position: relative;
				color: #fff;
				font-family: "Roboto", sans-serif;
				font-size: 14px;
				font-weight: 500;
				padding: 10px 14px;
				border-radius: 6px;
				display: flex;
				align-items: center;
				width: fit-content;
				min-width: 250px;
				max-width: 80vw;
				word-break: break-word;
				white-space: normal;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
				animation: fade-in 0.3s ease-out;
				margin-bottom: 10px;
				pointer-events: auto;
      }
      .my-notify-icon {
        font-family: "Material Icons";
				margin-right: 8px;
				font-size: 20px;
      }
      .my-notify-message {
        flex: 1;
				word-break: break-word;
      }
      .my-notify-badge {
        animation: my-notify-badge 0.42s;
        padding: 4px 8px;
        position: absolute;
        background-color: #c10015;
        color: #fff;
        border-radius: 6px;
        font-size: 12px;
        line-height: 12px;
        top: -6px;
        right: -22px;
        box-shadow: 0 0 0 2px white;
        font-weight: bold;
        text-align: center;
      }
      .my-notify-progress {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 3px;
				background-color: rgba(255, 255, 255, 0.6);
				animation: my-notif-progress-animation 3s linear forwards;
			}
      .my-hide {
        animation: fade-out 0.5s ease-in forwards;
      }
      @keyframes fade-out {
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
      @keyframes my-notify-badge {
        15% {
          transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }
        30% {
          transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
        }
        45% {
          transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }
        60% {
          transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
        }
        75% {
          transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
        }
      }
      @keyframes my-notif-progress-animation {
				from {
					width: 100%;
				}
				to {
					width: 0%;
				}
			}
    `;
    document.head.appendChild(style);
  }

  let container = document.querySelector(`.my-notify-container.my-notify-${position}`);
  if (!container)
  {
    container = document.createElement('div');
    container.classList.add('my-notify-container', `my-notify-${position}`);
    document.body.appendChild(container);
  }

  const myIcon = {
    success: 'check_circle',
    info: 'info',
    warning: 'error_outline',
    negative: 'warning',
  };

  if (notifyCache[message])
  {
    const { el, count, timeoutId } = notifyCache[message];
    const newCount = count + 1;
    notifyCache[message].count = newCount;

    const counterEl = el.querySelector('.my-notify-badge');
    if (counterEl)
    {
      counterEl.textContent = newCount.toString();
    } else
    {
      const newCounter = document.createElement('div');
      newCounter.className = 'my-notify-badge';
      newCounter.textContent = newCount.toString();
      el.appendChild(newCounter);
    }

    clearTimeout(timeoutId);
    notifyCache[message].timeoutId = setTimeout(() =>
    {
      el.classList.add('my-hide');
      setTimeout(() =>
      {
        el.remove();
        delete notifyCache[message];
      }, 500);
    }, timeout);

    return;
  }

  const mynotification = document.createElement('div');
  mynotification.classList.add('my-notify', `my-notify-${type}`);
  mynotification.innerHTML = `
      <i class="my-notify-icon material-icons">${myIcon[type] || 'info'}</i>
      <div class="my-notify-message">${message}</div>
      <div class="my-notify-progress" style="animation-duration: ${timeout}ms"></div>
    `;

  const timeoutId = setTimeout(() =>
  {
    mynotification.classList.add('my-hide');
    setTimeout(() => mynotification.remove(), 500);
    delete notifyCache[message];
  }, timeout);

  notifyCache[message] = { el: mynotification, count: 0, timeoutId };
  container.appendChild(mynotification);
}

export default MyNotify;
