let gridItems = document.querySelectorAll('.grid-os');
let body = document.querySelector('body');

function openApp(appId) {
  const appWindow = document.createElement('div');
  appWindow.id = window-`${appId}`;
  appWindow.classList.add('app-window');

  appWindow.style.width = '800px';
  appWindow.style.height = '500px';
  appWindow.style.border = '1px solid #fff';

  const titleBar = document.createElement('div');
  titleBar.classList.add('title-bar');

  const closeBtn = document.createElement('btn');
  closeBtn.textContent = '✕';

  closeBtn.addEventListener('click', () => {
    appWindow.remove();
  });

  // appWindow.innerHTML = `
  // <div class="title-bar">
  //   <span>${appId}</span>
  //   <button onclick="closeApp('${appId}')">✕</button>
  // </div>
  // <div class="app-content" id="content-${appId}"></div>
  // `;

  titleBar.appendChild(closeBtn);
  appWindow.appendChild(titleBar);
  document.getElementById("desktop").appendChild(appWindow);

  const appScript = document.createElement('script');
  appScript.src = `/${appId}`;
  document.body.appendChild(appScript);
}

gridItems.forEach(item => {
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;

    const openOption = document.createElement('div');
    openOption.textContent = 'Open';

    openOption.addEventListener('dblclick', () => {
      if (item.id === 'this-pc') {
        window.openApp('/App/this-pc.js', '_blank', 'width=800, height=600');
      }
      document.body.removeChild(contextMenu);
    })
  })
})

gridItems.forEach(item => {
  item.addEventListener('dblclick', () => {
    const thisPc = document.getElementById('this-pc');
    if (item === thisPc) {
      window.openApp('/App/this-pc.js', '_blank', 'width=800, height=600');
      return;
    }

    const fileExplorer = document.getElementById('file-explorer');
    if (item === fileExplorer) {
      window.openApp('/App/file-explorer.js', '_blank', 'width=400', 'height=300');
    }

    const notes = document.getElementById('notes');
    if (item === notes) {
      window.openApp('/App/file-explorer.js', '_blank', 'width=400', 'height=300');
    }

    const settings = document.getElementById('settings');
    if (item === settings) {
      window.openApp('/App/settings.js');
    }

    const music = document.getElementById('music');
    if (item === music) {
      window.openApp('/App/music.js');
    }
  });
});