/* App/this-pc.js - mount-friendly */
(function () {
  const containerId = window.__APP_CONTAINER_ID__ || null;
  const root = containerId ? document.getElementById(containerId) : null;

  function render(rootEl) {
    rootEl.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = 'This PC';
    rootEl.appendChild(h);
    const p = document.createElement('p');
    p.textContent = 'Files and drives would appear here.';
    rootEl.appendChild(p);
  }

  if (root) {
    render(root);
  } else {
    // fallback if loaded in top-level page
    document.addEventListener('DOMContentLoaded', () => {
      const bodyRoot = document.createElement('div');
      bodyRoot.style.padding = '20px';
      render(bodyRoot);
      document.body.appendChild(bodyRoot);
    });
  }
})();