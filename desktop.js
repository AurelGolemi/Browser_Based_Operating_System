let gridItems = document.querySelectorAll('.grid-os');
let body = document.querySelector('body');

function openApp(appId) {
  const appWindow = document.createElement('iframe');
  appWindow.id = appId;
  appWindow.classList.add('app-window');
  appWindow.style.width = features.split(',')[0].split('=')[1] + 'px';
  appWindow.style.height = features.split(',')[1].split('=')[1] + 'px';
  appWindow.innerHTML = `<iframe src="${appId}" frameborder="0" style="width: 100%; height: 100%;"></iframe>`;
  body.appendChild(appWindow);
  appWindow.focus();
  window.open(url, appWindow);
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

    const notes = window.openApp('', '_blank', 'width=400,height=300').document.write(`
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notes</title>
        </head>
        <body>
            <textarea id="notes-textarea" placeholder="Enter your notes here..." style="width: 100%; height: 100%;"></textarea>
        </body>
        </html>`
    );
    if (notes) {
      item.setAttribute('data-notes', notes);
    };

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