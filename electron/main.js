const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const { exec } = require('child_process');
const Store = require('electron-store');
const isDev = require('electron-is-dev');

// Initialize store for settings
const store = new Store();

// Create the browser window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#0f172a', // Tailwind gray-900
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  return mainWindow;
}

// App ready event
app.whenReady().then(() => {
  const mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Directory selection
ipcMain.handle('select-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  
  if (canceled) {
    return null;
  }
  
  return filePaths[0];
});

// Get temporary path
ipcMain.handle('get-temp-path', async (_, fileName) => {
  const tempDir = path.join(app.getPath('temp'), 'mmorpg-launcher');
  
  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  return path.join(tempDir, fileName);
});

// Read file
ipcMain.handle('read-file', async (_, filePath, encoding = 'utf8') => {
  try {
    if (encoding === 'binary') {
      return await fsp.readFile(filePath);
    }
    return await fsp.readFile(filePath, encoding);
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
});

// Write file
ipcMain.handle('write-file', async (_, filePath, data) => {
  try {
    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    await fsp.mkdir(dirPath, { recursive: true });
    
    // Write the file
    await fsp.writeFile(filePath, data);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw new Error(`Failed to write file: ${error.message}`);
  }
});

// Check if file exists
ipcMain.handle('file-exists', async (_, filePath) => {
  try {
    await fsp.access(filePath);
    return true;
  } catch {
    return false;
  }
});

// Ensure directory exists
ipcMain.handle('ensure-dir', async (_, dirPath) => {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw new Error(`Failed to create directory: ${error.message}`);
  }
});

// Launch game
ipcMain.handle('launch-game', async (_, installPath) => {
  try {
    // Find the executable
    const exePath = path.join(installPath, 'game.exe');
    const exeExists = await fsp.access(exePath).then(() => true).catch(() => false);
    
    if (!exeExists) {
      throw new Error('Game executable not found');
    }
    
    // Launch the game
    exec(`"${exePath}"`, (error) => {
      if (error) {
        console.error('Failed to launch game:', error);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error launching game:', error);
    throw new Error(`Failed to launch game: ${error.message}`);
  }
});

// Get app path
ipcMain.handle('get-app-path', async () => {
  return app.getPath('userData');
});