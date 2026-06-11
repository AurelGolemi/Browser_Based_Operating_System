const desktop = document.getElementById('desktop');
const taskbar = document.getElementById('taskbar');
const gridItems = document.querySelectorAll('.grid-os');
let body = document.querySelector('body');

let winCounter = 0;
let zIndexCounter = 500;

function bringToFront(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
  document.querySelectorAll('.app-window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
}

function createTaskbarButton(winId, title) {
  const btn = document.createElement('button');
  btn.className = 'taskbar-btn';
  btn.textContent = title;
  btn.dataset.winId = winId;
  btn.addEventListener('click', () => {
    const win = document.getElementById(winId);
    if (!win) return;
    if (win.classList.contains('minimized')) {
      win.classList.remove('minimized');
      bringToFront(win);
    } else {
      win.classList.add('minimized');
    }
  });
  taskbar.appendChild(btn);
  return btn;
}

function openApp({src, title = 'App', width = 800, height = 500}) {
  winCounter++;
  const winId = `win-${winCounter}`;
  const contentId = `${winId}-content`;

  const win = document.createElement('div');
  win.className = 'app-window';
  win.id = winId;
  win.style.width = `${width}px`;
  win.style.height = `${height}px`;
  win.style.left = `${50 + winCounter * 20}px`;
  win.style.top = `${50 + winCounter * 20}px`;
  win.style.zIndex = ++zIndexCounter;

  const titleBar = document.createElement('div');
  titleBar.className = 'title-bar';

  const titleLeft = document.createElement('div');
  titleLeft.className = 'title-left';
  const icon = document.createElement('div');
  icon.className = 'title-icon';
  titleLeft.appendChild(icon);
  const titleText = document.createElement('div');
  titleText.className = 'title-text';
  titleText.textContent = title;
  titleLeft.appendChild(titleText);

  const controls = document.createElement('div');
  controls.className = 'window-controls';

  const btnMin = document.createElement('button');
  btnMin.className = 'control-btn min-btn';
  btnMin.title = 'Minimize';
  btnMin.textContent = '▁';

  const btnMax = document.createElement('button');
  btnMax.className = 'control-btn max-btn';
  btnMax.title = 'Maximize';
  btnMax.textContent = '▢';

  const btnClose = document.createElement('button');
  btnClose.className = 'control-btn close-btn';
  btnClose.title = 'Close';
  btnClose.textContent = '✕';

  controls.appendChild(btnMin);
  controls.appendChild(btnMax);
  controls.appendChild(btnClose);

  titleBar.appendChild(titleLeft);
  titleBar.appendChild(controls);

  const content = document.createElement('div');
  content.className = 'app-content';
  content.id = contentId;

  win.appendChild(titleBar);
  win.appendChild(content);
  desktop.appendChild(win);

  const tbBtn = createTaskbarButton(winId, title);

  win.addEventListener('pointerdown', () => bringToFront(win));
  titleBar.addEventListener('pointerdown', () => bringToFront(win));

  titleBar.style.touchAction = 'none';
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  titleBar.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('control-btn')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(win.style.left, 10);
    startTop = parseInt(win.style.top, 10);
    titleBar.setPointerCapture(e.pointerId);
  });

  titleBar.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    win.style.left = `${Math.max(0, startLeft + dx)}px`;
    win.style.top = `${Math.max(0, startTop + dy)}px`;
  });

  titleBar.addEventListener('pointerup', (e) => {
    isDragging = false;
    try { titleBar.releasePointerCapture(e.pointerId); } catch (err) { }
  });

  let prevRect = null;

  btnMin.addEventListener('click', (e) => {
    e.stopPropagation();
    if (win.classList.contains('minimized')) {
      win.classList.remove('minimized');
      bringToFront(win);
    } else {
      win.classList.add('minimized');
    }
  });

  btnMax.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!win.classList.contains('maximized')) {
      win.classList.remove('minimized');
      prevRect = {
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height
      };
      win.style.left = '0px';
      win.style.top = '0px';
      win.style.width = '100%';
      win.style.height = `calc(100vh - ${taskbar.offsetHeight}px)`;
      win.classList.add('maximized');
      bringToFront(win);
    } else {
      win.style.left = prevRect.left;
      win.style.top = prevRect.top;
      win.style.width = prevRect.width;
      win.style.height = prevRect.height;
      win.classList.remove('maximized');
    }
  });

  btnClose.addEventListener('click', (e) => {
    e.stopPropagation();
    win.remove();
    tbBtn.remove();
  });

  const markerVar = '__APP_CONTAINER_ID__';
  window[markerVar] = contentId;

  const appScript = document.createElement('script');
  appScript.src = src;
  appScript.defer = true;
  appScript.onload = () => {
    delete window[markerVar];
  };
  appScript.onerror = () => {
    content.innerHTML = '<div class="app-error">Failed to load app.</div>';
    delete window[markerVar];
  };
  document.body.appendChild(appScript);

  bringToFront(win);

  return winId;
}

gridItems.forEach(item => {
  item.addEventListener('dblclick', () => {
    const id = item.id;
    if (id === 'this-pc') {
      openApp({ src: '/App/this-pc.js', title: 'This PC', width: 800, height: 600 });
    } else if (id === 'file-explorer') {
      openApp({src: '/App/file-explorer.js', title: 'File Explorer', width: 700, height: 500});
    } else if (id === 'notes') {
      openApp({src: '/App/notes.js', title: 'Notes', width: 600, height: 400});
    } else if (id === 'settings') {
      openApp({src: '/App/settings.js', title: 'Settings', width: 500, height: 400});
    } else if (id === 'music') {
      openApp({src: '/App/music.js', title: 'Music', width: 700, height: 450});
    }
  });
});

gridItems.forEach(item => {
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    const open = document.createElement('div');
    open.textContent = 'Open';
    open.className = 'context-item';
    open.addEventListener('click', () => {
      item.dispatchEvent(new Event('dblclick'));
      menu.remove();
    });
    menu.appendChild(open);
    document.body.appendChild(menu);
    const remove = () => menu.remove();
    setTimeout(() => window.addEventListener('click', remove, { once: true }), 10);
  });
})

window.openApp = openApp;