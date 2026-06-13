const fileSystem = {
  'C:': {
    'Program Files': {
      'File Explorer': {
        type: 'Application',
        date: '10/6/2026 3:12 PM',
        size: '450 KB'
      },
      'Notes': {
        type: 'Application',
        date: '10/6/2026 3:12 PM',
        size: '210 KB'
      },
      'Settings': {
        type: 'Application',
        date: '10/6/2026 3:12 PM',
        size: '130 KB',
      },
      'Music': {
        type: 'Application',
        date: '10/6/2026 3:12 PM',
        size: '15.4 MB'
      }
    },
    'Users': {
      'User': {
        'Documents': {
          'document.txt': {
            type: 'text document',
            date: '13/6/2026 3:32 PM',
            size: '180 bytes'
          },
          'dark.txt': {
            type: 'text document',
            date: '13/6/2026 3:33 PM',
            size: '230 bytes'
          }
        },
        'Downloads': {
          'Music': {
            type: 'Application',
            date: '10/6/2026 3:12 PM',
            size: '15.4 MB'
          }
        }
      }
    }
  }
};

class FileExplorer {
  constructor() {
    this.currentPath = ['C:'];
    this.history = [];
    this.historyIndex = -1;
  }

  // Get the current folder content
  getCurrentFolder() {
    let current = fileSystem;
    for (const dir of this.currentPath) {
      if (dir in current) {
        current = current[dir];
      }
    }
    return current;
  }

  // Navigate to a folder
  navigateToFolder(folderName) {
    const current = this.getCurrentFolder();
    if (folderName in current && !('type' in current[folderName])) {
      this.addToHistory([...this.currentPath, folderName]);
      this.currentPath.push(folderName);
      return true;
    }
    return false;
  }

  // Go back
  goBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentPath = [...this.history[this.historyIndex]];
      return true;
    }
    return false;
  }

  // Go forward
  goForward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentPath = [...this.history[this.historyIndex]];
      return true;
    }
    return false;
  }

  // Go up one level
  goUp() {
    if (this.currentPath.length > 1) {
      this.addToHistory([...this.currentPath]);
      this.currentPath.pop();
      return true;
    }
    return false;
  }

  // Add to navigation history
  addToHistory(path) {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(path);
    this.historyIndex++;
  }

  // Get current path as string
  getPathString() {
    return this.currentPath.join('\\');
  }

  // Get folder contents as array
  getFolderContents() {
    const current = this.getCurrentFolder();
    return Object.entries(current).map(([name, entry]) => ({
      name,
      type: entry.type || 'Folder',
      date: entry.date || 'N/A',
      size: entry.size || '-',
      isFolder: !('type' in entry)
    }));
  }

  // Calculate total size
  getTotalSize() {
    const contents = this.getFolderContents();
    let total = 0;
    contents.forEach(item => {
      if (item.size !== '-') {
        const match = item.size.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/);
        if (match) {
          let bytes = parseFloat(match[1]);
          const unit = match[2];
          const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024**2, 'GB': 1024**3, 'TB': 1024**4 };
          total += bytes * (multipliers[unit] || 1);
        }
      }
    });
    return this.formatBytes(total);
  }

  // Format bytes to readable size
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Initialize
const explorer = new FileExplorer();

// Function to display file explorer window
function displayFileExplorer(contentDiv) {
  renderExplorerUI(contentDiv);
}

// Render the file explorer UI
function renderExplorerUI(container) {
  const html = `
    <div class="file-explorer">
      <!-- Navigation Bar -->
      <div class="explorer-navbar">
        <button class="nav-btn" id="backBtn" title="Back">←</button>
        <button class="nav-btn" id="forwardBtn" title="Forward">→</button>
        <button class="nav-btn" id="upBtn" title="Up">↑</button>
      </div>

      <!-- Address Bar -->
      <div class="address-bar">
        <span class="path-icon">📁</span>
        <input type="text" id="pathInput" class="path-input" readonly>
      </div>

      <!-- Main Content -->
      <div class="explorer-content">
        <!-- Sidebar -->
        <div class="explorer-sidebar">
          <div class="sidebar-section">
            <h3>Quick Access</h3>
            <div class="sidebar-item" data-path="C:">This PC</div>
            <div class="sidebar-item" data-path="C:\\Users\\User\\Documents">Documents</div>
            <div class="sidebar-item" data-path="C:\\Users\\User\\Downloads">Downloads</div>
          </div>
          <div class="sidebar-section">
            <h3>Drives</h3>
            <div class="sidebar-item" data-path="C:">C: Drive</div>
          </div>
        </div>

        <!-- File/Folder List -->
        <div class="explorer-main">
          <table class="file-table">
            <thead>
              <tr>
                <th class="col-name">Name</th>
                <th class="col-type">Type</th>
                <th class="col-date">Date Modified</th>
                <th class="col-size">Size</th>
              </tr>
            </thead>
            <tbody id="fileListBody">
              <!-- Files will be inserted here -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="explorer-statusbar">
        <span id="statusText">Ready</span>
        <span id="fileCount">0 items</span>
      </div>
    </div>
  `;

  container.innerHTML = html;
  attachEventListeners(container);
  updateFileList(container);
}

// Attach event listeners
function attachEventListeners(container) {
  const backBtn = container.querySelector('#backBtn');
  const forwardBtn = container.querySelector('#forwardBtn');
  const upBtn = container.querySelector('#upBtn');
  const pathInput = container.querySelector('#pathInput');
  const sidebarItems = container.querySelectorAll('.sidebar-item');
  const fileListBody = container.querySelector('#fileListBody');

  backBtn.addEventListener('click', () => {
    if (explorer.goBack()) {
      updateFileList(container);
    }
  });

  forwardBtn.addEventListener('click', () => {
    if (explorer.goForward()) {
      updateFileList(container);
    }
  });

  upBtn.addEventListener('click', () => {
    if (explorer.goUp()) {
      updateFileList(container);
    }
  });

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const path = item.dataset.path.split('\\');
      explorer.currentPath = path;
      explorer.addToHistory(path);
      updateFileList(container);
    });
  });

  fileListBody.addEventListener('dblclick', (e) => {
    const row = e.target.closest('tr');
    if (row) {
      const folderName = row.dataset.name;
      const isFolder = row.dataset.isFolder === 'true';
      if (isFolder && explorer.navigateToFolder(folderName)) {
        updateFileList(container);
      }
    }
  });

  fileListBody.addEventListener('click', (e) => {
    const rows = container.querySelectorAll('.file-table tbody tr');
    rows.forEach(r => r.classList.remove('selected'));
    const row = e.target.closest('tr');
    if (row) row.classList.add('selected');
  });
}

// Update file list display
function updateFileList(container) {
  const pathInput = container.querySelector('#pathInput');
  const fileListBody = container.querySelector('#fileListBody');
  const fileCount = container.querySelector('#fileCount');

  pathInput.value = explorer.getPathString();
  const contents = explorer.getFolderContents();

  fileListBody.innerHTML = contents.map(item => `
    <tr data-name="${item.name}" data-is-folder="${item.isFolder}">
      <td class="col-name">
        <span class="file-icon">${item.isFolder ? '📁' : '📄'}</span>
        ${item.name}
      </td>
      <td class="col-type">${item.type}</td>
      <td class="col-date">${item.date}</td>
      <td class="col-size">${item.size}</td>
    </tr>
  `).join('');

  fileCount.textContent = `${contents.length} item${contents.length !== 1 ? 's' : ''}`;
}