const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  getTempPath: (fileName) => ipcRenderer.invoke('get-temp-path', fileName),
  readFile: (filePath, encoding) => ipcRenderer.invoke('read-file', filePath, encoding),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  ensureDir: (dirPath) => ipcRenderer.invoke('ensure-dir', dirPath),
  
  // Game operations
  launchGame: (installPath) => ipcRenderer.invoke('launch-game', installPath),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // Event listeners
  on: (channel, callback) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },
  once: (channel, callback) => {
    ipcRenderer.once(channel, (_, ...args) => callback(...args));
  },
  
  // Send events
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  }
});