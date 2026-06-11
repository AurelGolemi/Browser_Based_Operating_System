/* App/this-pc.js - Full-featured This PC implementation */
(function () {
  const containerId = window.__APP_CONTAINER_ID__ || null;
  const root = containerId ? document.getElementById(containerId) : null;

  const thisPCData = {
    folders: [
      { name: 'Desktop', icon: '/Img/desktop.png', path: '/Desktop' },
      { name: 'Documents', icon: '/Img/documents.png', path: '/Documents' },
      { name: 'Downloads', icon: '/Img/downloads.png', path: '/Downloads' },
      { name: 'Pictures', icon: '/Img/pictures.png', path: '/Pictures' },
      { name: 'Music', icon: '/Img/music.png', path: '/Music' },
      { name: 'Videos', icon: '/Img/videos.png', path: '/Videos' },
    ],
    devices: [
      { name: 'Local Disk (C:)', space: 500, free: 250, type: 'drive', icon: '/Img/network.png' },
      { name: 'Data (D:)', space: 1000, free: 750, type: 'drive', icon: '/Img/network.png' },
      { name: 'USB Drive', space: 64, free: 32, type: 'removable', icon: '/Img/network.png' },
    ]
  };

  const sidebarCategories = [
    { id: 'quick-access', label: 'Quick Access', icon: '/Img/quick-access.png' },
    { id: 'this-pc', label: 'This PC', icon: '/Img/computer.png' },
    { id: 'network', label: 'Network', icon: '/Img/network.png' },
  ];

  function createToolbar(parentEl) {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.style.cssText = `
      display: flex;
      gap: 10px;
      padding: 10px;
      color: #111;
      background: #f0f0f0;
      border-bottom: 1px solid #ddd;
      flex-wrap: wrap;
    `;

    const buttons = [
      { label: 'Properties', icon: '⚙️' },
      { label: 'Access Media', icon: '📀' },
      { label: 'Map Network Drive', icon: '🔗' },
      { label: 'Add Network Location', icon: '➕' },
    ];

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.style.cssText = `
        padding: 8px 12px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        color: #111;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: background 0.2s;
      `;
      button.textContent = `${btn.icon} ${btn.label}`;
      button.onmouseover = () => button.style.background = '#e8e8e8';
      button.onmouseout = () => button.style.background = 'white';
      button.onclick = () => alert(`${btn.label} clicked`);
      toolbar.appendChild(button);
    });

    parentEl.appendChild(toolbar);
    return toolbar;
  }

  function createSidebar(parentEl, onCategoryClick) {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.style.cssText = `
      width: 200px;
      background: #f5f5f5;
      border-right: 1px solid #ddd;
      color: #111;
      padding: 10px 0;
      overflow-y: auto;
      flex-shrink: 0;
    `;

    sidebarCategories.forEach(category => {
      const item = document.createElement('div');
      item.className = 'sidebar-item';
      item.dataset.id = category.id;
      item.style.cssText = `
        padding: 12px 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        user-select: none;
        transition: background 0.2s;
      `;
      item.textContent = `${category.icon} ${category.label}`;
      
      item.onmouseover = () => item.style.background = '#e0e0e0';
      item.onmouseout = () => item.style.background = 'transparent';
      item.onclick = () => {
        document.querySelectorAll('.sidebar-item').forEach(el => {
          el.style.background = 'transparent';
        });
        item.style.background = '#d0d0d0';
        onCategoryClick(category.id);
      };

      sidebar.appendChild(item);
    });

    parentEl.appendChild(sidebar);
    return sidebar;
  }

  function createFoldersSection(parentEl, folders) {
    const section = document.createElement('div');
    section.className = 'folders-section';
    section.style.cssText = `
      padding: 20px;
      border-bottom: 2px solid #ddd;
      color: #111;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Folders';
    title.style.cssText = 'margin: 0 0 15px 0; font-size: 14px; color: #666;';
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'folders-grid';
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 15px;
    `;

    folders.forEach(folder => {
      const tile = document.createElement('div');
      tile.className = 'folder-tile';
      tile.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 10px;
        border-radius: 4px;
        transition: background 0.2s;
        user-select: none;
      `;

      const icon = document.createElement('img');
      icon.src = folder.icon;
      icon.alt = folder.name;
      icon.style.cssText = `
        width: 48px;
        height: 48px;
        object-fit: contain;
      `

      const name = document.createElement('span');
      name.textContent = folder.name;
      name.style.cssText = `
        font-size: 12px;
        text-align: center;
        word-break: break-word;
      `;

      tile.appendChild(icon);
      tile.appendChild(name);

      tile.onmouseover = () => tile.style.background = '#e3f2fd';
      tile.onmouseout = () => tile.style.background = 'transparent';
      tile.onclick = () => alert(`Opening ${folder.name}`);

      grid.appendChild(tile);
    });

    section.appendChild(grid);
    parentEl.appendChild(section);
    return section;
  }

  function createDevicesSection(parentEl, devices) {
    const section = document.createElement('div');
    section.className = 'devices-section';
    section.style.cssText = `
      padding: 20px;
      color: #111;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Devices and Drives';
    title.style.cssText = 'margin: 0 0 15px 0; font-size: 14px; color: #666;';
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'devices-grid';
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    `;

    devices.forEach(device => {
      const tile = document.createElement('div');
      tile.className = 'device-tile';
      tile.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        cursor: pointer;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        transition: all 0.2s;
      `;

      const deviceIcon = document.createElement('div');
      deviceIcon.style.cssText = 'font-size: 24px;';
      deviceIcon.textContent = device.type === 'drive' ? '/Img/drive.png' : '/Img/usb-drive.png';

      const name = document.createElement('div');
      name.textContent = device.name;
      name.style.cssText = 'font-size: 13px; font-weight: bold;';

      const capacityBar = document.createElement('div');
      capacityBar.style.cssText = `
        width: 100%;
        height: 6px;
        background: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
      `;

      const usedBar = document.createElement('div');
      const percentUsed = ((device.space - device.free) / device.space) * 100;
      usedBar.style.cssText = `
        width: ${percentUsed}%;
        height: 100%;
        background: #42a5f5;
        transition: width 0.3s;
      `;
      capacityBar.appendChild(usedBar);

      const capacity = document.createElement('div');
      capacity.textContent = `${device.free} GB free of ${device.space} GB`;
      capacity.style.cssText = 'font-size: 11px; color: #666;';

      tile.appendChild(deviceIcon);
      tile.appendChild(name);
      tile.appendChild(capacityBar);
      tile.appendChild(capacity);

      tile.onmouseover = () => {
        tile.style.background = '#f5f5f5';
        tile.style.borderColor = '#999';
      };
      tile.onmouseout = () => {
        tile.style.background = 'white';
        tile.style.borderColor = '#ddd';
      };
      tile.onclick = () => alert(`Opening ${device.name}`);

      grid.appendChild(tile);
    });

    section.appendChild(grid);
    parentEl.appendChild(section);
    return section;
  }

  function render(rootEl) {
    rootEl.innerHTML = '';
    rootEl.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    `;

    createToolbar(rootEl);

    // Create main content wrapper (sidebar + content)
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
      display: flex;
      flex: 1;
      overflow: hidden;
    `;

    const onCategoryClick = (categoryId) => {
      console.log('Category clicked:', categoryId);
      // You can add logic here to filter content based on category
    };
    createSidebar(mainContent, onCategoryClick);

    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    `;

    createFoldersSection(contentArea, thisPCData.folders);
    createDevicesSection(contentArea, thisPCData.devices);

    mainContent.appendChild(contentArea);
    rootEl.appendChild(mainContent);
  }

  if (root) {
    render(root);
  } else {
    // fallback if loaded in top-level page
    document.addEventListener('DOMContentLoaded', () => {
      const bodyRoot = document.createElement('div');
      bodyRoot.style.cssText = `
        padding: 0;
        height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;
      render(bodyRoot);
      document.body.appendChild(bodyRoot);
    });
  }
})();