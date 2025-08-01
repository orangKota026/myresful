export const showLoading = async () =>
{
  const existingLoader = document.getElementById("myloading");
  if (existingLoader)
  {
    existingLoader.remove();
  }

  if (!document.getElementById("myloading-style"))
  {
    const style = document.createElement("style");
    style.id = "myloading-style";

    const importFonts = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Roboto"]')
      ? ""
      : `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`;

    style.innerHTML = `
      ${importFonts}
      .myloading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: 'Roboto', sans-serif;
        color: #fff;
        font-size: 18px;
        opacity: 0;
        animation: fadeIn 300ms ease-out forwards;
        z-index: 9999;
      }
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top: 5px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }
      .loading-text span {
        display: inline-block;
        animation: blink 1.5s infinite;
      }
      .loading-text span:nth-child(1) { animation-delay: 0s; }
      .loading-text span:nth-child(2) { animation-delay: 0.2s; }
      .loading-text span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const loader = document.createElement("div");
  loader.id = "myloading";
  loader.classList.add("myloading");
  loader.innerHTML = `
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading<span>.</span><span>.</span><span>.</span></p>
  `;

  document.body.appendChild(loader);

  return new Promise((resolve) => setTimeout(resolve, 300));
};

export const hideLoading = async () =>
{
  const el = document.getElementById("myloading");
  if (!el) return true;

  el.style.animation = 'fadeOut 300ms ease-out forwards';

  return new Promise((resolve) =>
  {
    setTimeout(() =>
    {
      el.remove();
      resolve(true);
    }, 300);
  });
};