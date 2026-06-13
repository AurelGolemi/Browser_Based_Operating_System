let notesElement = document.getElementById("notes");

class NotesApp {
  constructor() {
    this.currentFile = "Untitled";
    this.isModified = false;
    this.undoStack = [];
    this.redoStack = [];
    this.fontSize = 12;
    this.fontFamily = "Consolas, monospace";
    this.wordWrap = true;
    this.winCounter = (window.winCounter || 0) + 1;
    this.winId = `notes-window-${this.winCounter}`;
    this.notepad = null;
  }

  openNotesWindow() {
    if (!document.getElementById(this.winId)) {
      const notepad = this.createNotepadWindow();
      const desktop = document.getElementById("desktop");
      desktop.appendChild(notepad);
      this.setupEventListeners(notepad);
      this.createTaskbarButton();
      bringToFront(notepad);
    } else {
      const existing = document.getElementById(this.winId);
      if (existing.classList.contains("minimized")) {
        existing.classList.remove("minimized");
      }
      bringToFront(existing);
    }
  }

  createTaskbarButton() {
    const taskbar = document.getElementById("taskbar");
    const btn = document.createElement("button");
    btn.className = "taskbar-btn";
    btn.textContent = `Notepad - ${this.currentFile}`;
    btn.dataset.winId = this.winId;
    btn.addEventListener("click", () => {
      const win = document.getElementById(this.winId);
      if (!win) return;
      if (win.classList.contains("minimized")) {
        win.classList.remove("minimized");
        bringToFront(win);
      } else {
        win.classList.add("minimized");
      }
    });
    taskbar.appendChild(btn);
  }

  createNotepadWindow() {
    const win = document.createElement("div");
    win.className = "app-window";
    win.id = this.winId;
    win.style.width = "800px";
    win.style.height = "600px";
    win.style.left = "100px";
    win.style.top = "100px";
    win.style.zIndex = 500;
    win.innerHTML = `
      <div class="window-header" style="display: flex; justify-content: space-between; align-items: center; height: 32px; background: linear-gradient(180deg, #0078d4, #0078d4); color: white; padding: 0 8px; border-bottom: 1px solid #005a9e; font-size: 13px; cursor: move; user-select: none;">
        <span class="window-title" style="flex: 1; font-weight: 500;">Notepad - ${this.currentFile}</span>
        <div class="window-controls" style="display: flex; gap: 4px;">
          <button class="minimize-btn" style="width: 28px; height: 26px; border: none; background: transparent; color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">_</button>
          <button class="maximize-btn" style="width: 28px; height: 26px; border: none; background: transparent; color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">☐</button>
          <button class="close-btn" style="width: 28px; height: 26px; border: none; background: transparent; color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">✕</button>
        </div>
      </div>

      <div class="notepad-menu" style="display: flex; height: 24px; background: #f0f0f0; border-bottom: 1px solid #c0c0c0; position: relative;">
        <div class="menu-item" style="position: relative; padding: 0 8px; display: flex; align-items: center; font-size: 12px; cursor: pointer; user-select: none;">
          <span style="color: #000;">File</span>
          <div class="submenu" style="display: none; position: absolute; top: 24px; left: 0; background: #f0f0f0; border: 1px solid #a0a0a0; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2); z-index: 1000; min-width: 200px;">
            <div class="submenu-item" data-action="new" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">New (Ctrl+N)</div>
            <div class="submenu-item" data-action="open" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Open (Ctrl+O)</div>
            <div class="submenu-item" data-action="save" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Save (Ctrl+S)</div>
            <div class="submenu-item" data-action="saveas" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Save As</div>
            <hr style="margin: 4px 0; border: none; border-top: 1px solid #ccc;">
            <div class="submenu-item" data-action="exit" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Exit</div>
          </div>
        </div>
        <div class="menu-item" style="position: relative; padding: 0 8px; display: flex; align-items: center; font-size: 12px; cursor: pointer; user-select: none;">
          <span style="color: #000;">Edit</span>
          <div class="submenu" style="display: none; position: absolute; top: 24px; left: 0; background: #f0f0f0; border: 1px solid #a0a0a0; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2); z-index: 1000; min-width: 200px;">
            <div class="submenu-item" data-action="undo" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Undo (Ctrl+Z)</div>
            <div class="submenu-item" data-action="redo" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Redo (Ctrl+Y)</div>
            <hr style="margin: 4px 0; border: none; border-top: 1px solid #ccc;">
            <div class="submenu-item" data-action="cut" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Cut (Ctrl+X)</div>
            <div class="submenu-item" data-action="copy" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Copy (Ctrl+C)</div>
            <div class="submenu-item" data-action="paste" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Paste (Ctrl+V)</div>
            <hr style="margin: 4px 0; border: none; border-top: 1px solid #ccc;">
            <div class="submenu-item" data-action="selectall" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Select All (Ctrl+A)</div>
            <div class="submenu-item" data-action="find" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Find & Replace (Ctrl+H)</div>
          </div>
        </div>
        <div class="menu-item" style="position: relative; padding: 0 8px; display: flex; align-items: center; font-size: 12px; cursor: pointer; user-select: none;">
          <span style="color: #000;">Format</span>
          <div class="submenu" style="display: none; position: absolute; top: 24px; left: 0; background: #f0f0f0; border: 1px solid #a0a0a0; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2); z-index: 1000; min-width: 200px;">
            <div class="submenu-item" data-action="wordwrap" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Word Wrap</div>
            <div class="submenu-item" data-action="font" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Font</div>
          </div>
        </div>
        <div class="menu-item" style="position: relative; padding: 0 8px; display: flex; align-items: center; font-size: 12px; cursor: pointer; user-select: none;">
          <span style="color: #000;">View</span>
          <div class="submenu" style="display: none; position: absolute; top: 24px; left: 0; background: #f0f0f0; border: 1px solid #a0a0a0; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2); z-index: 1000; min-width: 200px;">
            <div class="submenu-item" data-action="statusbar" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Status Bar</div>
            <div class="submenu-item" data-action="zoom-in" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Zoom In (Ctrl++)</div>
            <div class="submenu-item" data-action="zoom-out" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">Zoom Out (Ctrl+-)</div>
          </div>
        </div>
        <div class="menu-item" style="position: relative; padding: 0 8px; display: flex; align-items: center; font-size: 12px; cursor: pointer; user-select: none;">
          <span style="color: #000;">Help</span>
          <div class="submenu" style="display: none; position: absolute; top: 24px; left: 0; background: #f0f0f0; border: 1px solid #a0a0a0; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2); z-index: 1000; min-width: 200px;">
            <div class="submenu-item" data-action="about" style="padding: 4px 20px; font-size: 12px; color: #000; cursor: pointer; white-space: nowrap;">About Notepad</div>
          </div>
        </div>
      </div>

      <div class="notepad-content" style="flex: 1; display: flex; overflow: hidden; background: white;">
        <textarea id="notepad-textarea" class="notepad-editor" placeholder="Start typing..." style="flex: 1; border: none; padding: 4px; font-family: Consolas, 'Courier New', monospace; font-size: 12px; line-height: 1.5; resize: none; outline: none; white-space: pre-wrap; word-wrap: break-word; background: white; color: #000;"></textarea>
      </div>

      <div class="notepad-statusbar" style="height: 20px; background: #f0f0f0; border-top: 1px solid #c0c0c0; padding: 0 4px; display: flex; align-items: center; font-size: 11px; color: #666; user-select: none;">
        <span>Line <span id="line-count">1</span>, Column <span id="column-count">1</span></span>
      </div>

      <div id="find-replace-dialog" class="find-replace-hidden" style="display: none; position: fixed; bottom: 100px; right: 20px; background: #f0f0f0; border: 1px solid #a0a0a0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); z-index: 1001; border-radius: 4px;">
        <div class="find-replace-content" style="padding: 12px; display: flex; flex-direction: column; gap: 8px; min-width: 300px;">
          <label style="font-size: 12px; color: #000; font-weight: bold;">Find:</label>
          <input type="text" id="find-input" placeholder="Find what" style="padding: 4px 6px; border: 1px solid #999; border-radius: 3px; font-size: 12px;">
          <label style="font-size: 12px; color: #000; font-weight: bold;">Replace:</label>
          <input type="text" id="replace-input" placeholder="Replace with" style="padding: 4px 6px; border: 1px solid #999; border-radius: 3px; font-size: 12px;">
          <button id="find-btn" style="padding: 4px 12px; border: 1px solid #999; background: #e0e0e0; cursor: pointer; font-size: 11px; border-radius: 3px;">Find All</button>
          <button id="replace-btn" style="padding: 4px 12px; border: 1px solid #999; background: #e0e0e0; cursor: pointer; font-size: 11px; border-radius: 3px;">Replace</button>
          <button id="replace-all-btn" style="padding: 4px 12px; border: 1px solid #999; background: #e0e0e0; cursor: pointer; font-size: 11px; border-radius: 3px;">Replace All</button>
          <button id="close-find-btn" style="padding: 4px 12px; border: 1px solid #999; background: #e0e0e0; cursor: pointer; font-size: 11px; border-radius: 3px;">Close</button>
        </div>
      </div>
    `;

    // Add dragging functionality
    this.makeWindowDraggable(win);

    return win;
  }

  makeWindowDraggable(win) {
    const header = win.querySelector(".window-header");
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    header.addEventListener("mousedown", (e) => {
      if (e.target.closest(".window-controls")) return;
      isDragging = true;
      initialX = e.clientX - win.offsetLeft;
      initialY = e.clientY - win.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        win.style.left = currentX + "px";
        win.style.top = currentY + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  setupEventListeners(notepad) {
    this.notepad = notepad;
    const textarea = notepad.querySelector("#notepad-textarea");
    const closeBtn = notepad.querySelector(".close-btn");
    const minimizeBtn = notepad.querySelector(".minimize-btn");
    const maximizeBtn = notepad.querySelector(".maximize-btn");

    // Hover effects for buttons
    closeBtn.addEventListener(
      "mouseover",
      () => (closeBtn.style.background = "#c42b1c"),
    );
    closeBtn.addEventListener(
      "mouseout",
      () => (closeBtn.style.background = "transparent"),
    );
    minimizeBtn.addEventListener(
      "mouseover",
      () => (minimizeBtn.style.background = "rgba(255, 255, 255, 0.2)"),
    );
    minimizeBtn.addEventListener(
      "mouseout",
      () => (minimizeBtn.style.background = "transparent"),
    );
    maximizeBtn.addEventListener(
      "mouseover",
      () => (maximizeBtn.style.background = "rgba(255, 255, 255, 0.2)"),
    );
    maximizeBtn.addEventListener(
      "mouseout",
      () => (maximizeBtn.style.background = "transparent"),
    );

    // Window controls
    closeBtn.addEventListener("click", () => {
      if (this.isModified) {
        const save = confirm(`Save changes to "${this.currentFile}"?`);
        if (save) this.saveFile(textarea);
      }
      notepad.remove();
      document.querySelector(`button[data-win-id="${this.winId}"]`)?.remove();
    });

    minimizeBtn.addEventListener("click", () => {
      notepad.classList.toggle("minimized");
    });

    maximizeBtn.addEventListener("click", () => {
      notepad.classList.toggle("maximized");
      if (notepad.classList.contains("maximized")) {
        notepad.style.left = "0";
        notepad.style.top = "32px";
        notepad.style.width = "100vw";
        notepad.style.height = "calc(100vh - 92px)";
        notepad.style.borderRadius = "0";
      } else {
        notepad.style.left = "100px";
        notepad.style.top = "100px";
        notepad.style.width = "800px";
        notepad.style.height = "600px";
        notepad.style.borderRadius = "6px";
      }
    });

    // Menu items event listeners
    const menuItems = notepad.querySelectorAll(".submenu-item");
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.handleMenuAction(item.dataset.action, textarea, notepad);
        // Close menu after selection
        notepad
          .querySelectorAll(".submenu")
          .forEach((s) => (s.style.display = "none"));
      });
    });

    // Menu toggle
    const menus = notepad.querySelectorAll(".menu-item > span");
    menus.forEach((menu) => {
      menu.addEventListener("click", (e) => {
        const submenu = e.target.nextElementSibling;
        // Close all other submenus
        notepad.querySelectorAll(".submenu").forEach((s) => {
          if (s !== submenu) s.style.display = "none";
        });
        submenu.style.display =
          submenu.style.display === "none" ? "block" : "none";
      });
    });

    // Close menu on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".notepad-menu")) {
        notepad
          .querySelectorAll(".submenu")
          .forEach((s) => (s.style.display = "none"));
      }
    });

    // Bring to front on any notepad interaction
    notepad.addEventListener("mousedown", () => {
      bringToFront(notepad);
    });

    // Textarea tracking
    textarea.addEventListener("input", () => {
      this.isModified = true;
      this.updateStatusBar(notepad, textarea);
      this.updateTitle(notepad);
    });

    textarea.addEventListener("keydown", (e) => {
      // Keyboard shortcuts
      if (e.ctrlKey) {
        if (e.key === "n") {
          e.preventDefault();
          this.newFile(textarea, notepad);
        } else if (e.key === "s") {
          e.preventDefault();
          this.saveFile(textarea);
        } else if (e.key === "h") {
          e.preventDefault();
          this.toggleFindReplace(notepad);
        } else if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          this.zoomIn(textarea);
        } else if (e.key === "-") {
          e.preventDefault();
          this.zoomOut(textarea);
        } else if (e.key === "z") {
          e.preventDefault();
          this.undo(textarea);
        } else if (e.key === "y") {
          e.preventDefault();
          this.redo(textarea);
        }
      }
    });

    // Update status bar
    textarea.addEventListener("click", () => {
      this.updateStatusBar(notepad, textarea);
    });
    textarea.addEventListener("keyup", () => {
      this.updateStatusBar(notepad, textarea);
    });

    // Find and Replace handlers
    const findBtn = notepad.querySelector("#find-btn");
    const replaceBtn = notepad.querySelector("#replace-btn");
    const replaceAllBtn = notepad.querySelector("#replace-all-btn");
    const closeFindBtn = notepad.querySelector("#close-find-btn");

    findBtn?.addEventListener("click", () => this.findAll(textarea, notepad));
    replaceBtn?.addEventListener("click", () =>
      this.replaceNext(textarea, notepad),
    );
    replaceAllBtn?.addEventListener("click", () =>
      this.replaceAll(textarea, notepad),
    );
    closeFindBtn?.addEventListener("click", () =>
      this.toggleFindReplace(notepad),
    );

    // Load last saved content
    this.loadFile(textarea);
    this.updateTitle(notepad);
  }

  handleMenuAction(action, textarea, notepad) {
    switch (action) {
      case "new":
        this.newFile(textarea, notepad);
        break;
      case "open":
        this.openFile(textarea, notepad);
        break;
      case "save":
        this.saveFile(textarea);
        break;
      case "saveas":
        this.saveAsFile(textarea, notepad);
        break;
      case "exit":
        if (this.isModified) {
          const save = confirm(`Save changes to "${this.currentFile}"?`);
          if (save) this.saveFile(textarea);
        }
        notepad.remove();
        document.querySelector(`button[data-win-id="${this.winId}"]`)?.remove();
        break;
      case "undo":
        this.undo(textarea);
        break;
      case "redo":
        this.redo(textarea);
        break;
      case "cut":
        document.execCommand("cut");
        break;
      case "copy":
        document.execCommand("copy");
        break;
      case "paste":
        document.execCommand("paste");
        break;
      case "selectall":
        textarea.select();
        break;
      case "find":
        this.toggleFindReplace(notepad);
        break;
      case "wordwrap":
        this.toggleWordWrap(textarea);
        break;
      case "font":
        this.openFontDialog(textarea);
        break;
      case "statusbar":
        notepad.querySelector(".notepad-statusbar").style.display =
          notepad.querySelector(".notepad-statusbar").style.display === "none"
            ? "block"
            : "none";
        break;
      case "zoom-in":
        this.zoomIn(textarea);
        break;
      case "zoom-out":
        this.zoomOut(textarea);
        break;
      case "about":
        alert(
          "Notepad\n\nA simple and elegant text editor for your browser-based OS.\n\nInspired by Windows Notepad",
        );
        break;
    }
  }

  newFile(textarea, notepad) {
    if (this.isModified) {
      const save = confirm(`Save changes to "${this.currentFile}"?`);
      if (save) this.saveFile(textarea);
    }
    textarea.value = "";
    this.currentFile = "Untitled";
    this.isModified = false;
    this.undoStack = [];
    this.redoStack = [];
    this.updateTitle(notepad);
  }

  saveFile(textarea) {
    localStorage.setItem(`notepad_${this.currentFile}`, textarea.value);
    localStorage.setItem("notepad_lastfile", this.currentFile);
    this.isModified = false;
    if (this.notepad) {
      this.updateTitle(this.notepad);
    }
    alert(`Saved to "${this.currentFile}"`);
  }

  saveAsFile(textarea, notepad) {
    const newName = prompt("Enter file name:", this.currentFile);
    if (newName && newName.trim()) {
      this.currentFile = newName.trim();
      this.saveFile(textarea);
      this.updateTitle(notepad);
    }
  }

  openFile(textarea, notepad) {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("notepad_") && key !== "notepad_lastfile") {
        files.push(key.replace("notepad_", ""));
      }
    }

    if (files.length === 0) {
      alert("No saved files found.");
      return;
    }

    let fileList = "Available files:\n\n";
    files.forEach((file, index) => {
      fileList += `${index + 1}. ${file}\n`;
    });
    fileList += "\nEnter the number or name of the file to open:";

    const input = prompt(fileList);
    if (input) {
      let selectedFile = input.trim();
      if (!isNaN(selectedFile)) {
        selectedFile = files[parseInt(selectedFile) - 1];
      }

      if (files.includes(selectedFile)) {
        if (this.isModified) {
          const save = confirm(`Save changes to "${this.currentFile}"?`);
          if (save) this.saveFile(textarea);
        }
        this.currentFile = selectedFile;
        textarea.value = localStorage.getItem(`notepad_${selectedFile}`) || "";
        this.isModified = false;
        this.updateTitle(notepad);
      } else {
        alert("File not found.");
      }
    }
  }

  loadFile(textarea) {
    const lastFile = localStorage.getItem("notepad_lastfile");
    if (lastFile) {
      this.currentFile = lastFile;
      const content = localStorage.getItem(`notepad_${lastFile}`);
      if (content) {
        textarea.value = content;
      }
    }
    this.isModified = false;
  }

  updateTitle(notepad) {
    const titleElement = notepad.querySelector(".window-title");
    const prefix = this.isModified ? "*" : "";
    titleElement.textContent = `${prefix}Notepad - ${this.currentFile}`;
  }

  updateStatusBar(notepad, textarea) {
    const lines = textarea.value.split("\n");
    const currentLine = textarea.value
      .substring(0, textarea.selectionStart)
      .split("\n").length;
    const currentColumn =
      textarea.selectionStart -
      textarea.value.lastIndexOf("\n", textarea.selectionStart - 1);

    notepad.querySelector("#line-count").textContent = currentLine;
    notepad.querySelector("#column-count").textContent = currentColumn;
  }

  undo(textarea) {
    if (this.undoStack.length > 0) {
      this.redoStack.push(textarea.value);
      textarea.value = this.undoStack.pop();
      this.updateTitle(this.notepad);
    }
  }

  redo(textarea) {
    if (this.redoStack.length > 0) {
      this.undoStack.push(textarea.value);
      textarea.value = this.redoStack.pop();
      this.updateTitle(this.notepad);
    }
  }

  toggleWordWrap(textarea) {
    this.wordWrap = !this.wordWrap;
    textarea.style.whiteSpace = this.wordWrap ? "pre-wrap" : "pre";
  }

  toggleFindReplace(notepad) {
    const dialog = notepad.querySelector("#find-replace-dialog");
    dialog.style.display = dialog.style.display === "none" ? "block" : "none";

    if (dialog.style.display === "block") {
      notepad.querySelector("#find-input").focus();
    }
  }

  findAll(textarea, notepad) {
    const findInput = notepad.querySelector("#find-input");
    const searchTerm = findInput.value;
    if (!searchTerm) {
      alert("Enter search term");
      return;
    }

    const regex = new RegExp(searchTerm, "gi");
    const matches = textarea.value.match(regex);
    alert(`Found ${matches ? matches.length : 0} matches`);
  }

  replaceNext(textarea, notepad) {
    const findInput = notepad.querySelector("#find-input");
    const replaceInput = notepad.querySelector("#replace-input");
    const searchTerm = findInput.value;
    const replaceTerm = replaceInput.value;

    if (!searchTerm) {
      alert("Enter search term");
      return;
    }

    textarea.value = textarea.value.replace(searchTerm, replaceTerm);
    this.isModified = true;
    this.updateTitle(notepad);
  }

  replaceAll(textarea, notepad) {
    const findInput = notepad.querySelector("#find-input");
    const replaceInput = notepad.querySelector("#replace-input");
    const searchTerm = findInput.value;
    const replaceTerm = replaceInput.value;

    if (!searchTerm) {
      alert("Enter search term");
      return;
    }

    const regex = new RegExp(searchTerm, "g");
    textarea.value = textarea.value.replace(regex, replaceTerm);
    this.isModified = true;
    this.updateTitle(notepad);
    alert("Replace All completed");
  }

  openFontDialog(textarea) {
    const size = prompt("Enter font size (8-72):", this.fontSize);
    if (size && size > 7 && size < 73) {
      this.fontSize = size;
      textarea.style.fontSize = `${size}px`;
    }
  }

  zoomIn(textarea) {
    this.fontSize = Math.min(72, this.fontSize + 2);
    textarea.style.fontSize = `${this.fontSize}px`;
  }

  zoomOut(textarea) {
    this.fontSize = Math.max(8, this.fontSize - 2);
    textarea.style.fontSize = `${this.fontSize}px`;
  }
}

const notesApp = new NotesApp();

notesElement.addEventListener("dblclick", () => {
  notesApp.openNotesWindow();
});

// Also handle click from taskbar
const taskbarNotesBtn = document.querySelector("#taskbar #notes");
if (taskbarNotesBtn) {
  taskbarNotesBtn.addEventListener("click", () => {
    notesApp.openNotesWindow();
  });
}