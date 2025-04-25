interface IpcRenderer {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  on: (channel: string, listener: (...args: any[]) => void) => void;
  once: (channel: string, listener: (...args: any[]) => void) => void;
  removeListener: (channel: string, listener: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
}

const mockIpcRenderer: IpcRenderer = {
  invoke: async (channel: string, ...args: any[]) => {
    console.log('IPC invoke:', channel, args);
    
    // Mock implementations for testing in browser
    switch (channel) {
      case 'get-temp-path':
        return `/temp/${args[0]}`;
      case 'read-file':
        if (localStorage.getItem(args[0])) {
          return localStorage.getItem(args[0]);
        }
        return '{}';
      case 'write-file':
        localStorage.setItem(args[0], args[1]);
        return true;
      case 'file-exists':
        return localStorage.getItem(args[0]) !== null;
      case 'ensure-dir':
        return true;
      case 'select-directory':
        return '/selected/directory';
      case 'launch-game':
        console.log('Launching game...');
        return true;
      case 'get-app-path':
        return '/app';
      default:
        return null;
    }
  },
  on: (channel: string, listener: (...args: any[]) => void) => {
    window.addEventListener(`ipc-${channel}`, (event: any) => {
      listener(...(event.detail || []));
    });
  },
  once: (channel: string, listener: (...args: any[]) => void) => {
    const onceListener = (event: any) => {
      listener(...(event.detail || []));
      window.removeEventListener(`ipc-${channel}`, onceListener);
    };
    window.addEventListener(`ipc-${channel}`, onceListener);
  },
  removeListener: (channel: string, listener: (...args: any[]) => void) => {
    window.removeEventListener(`ipc-${channel}`, listener as EventListener);
  },
  send: (channel: string, ...args: any[]) => {
    window.dispatchEvent(
      new CustomEvent(`ipc-${channel}`, { detail: args })
    );
  }
};

// Use the actual Electron IPC renderer if available, otherwise use the mock
let ipcRenderer: IpcRenderer;

try {
  // Check if we're in an Electron environment
  if (window.require && window.require('electron')) {
    ipcRenderer = window.require('electron').ipcRenderer;
  } else {
    ipcRenderer = mockIpcRenderer;
  }
} catch (error) {
  // Fallback to mock if not in Electron
  ipcRenderer = mockIpcRenderer;
}

export { ipcRenderer };

// Helper functions for common Electron operations
export const selectDirectory = async (): Promise<string | null> => {
  try {
    return await ipcRenderer.invoke('select-directory');
  } catch (error) {
    console.error('Failed to select directory:', error);
    return null;
  }
};

export const launchGame = async (installPath: string): Promise<boolean> => {
  try {
    return await ipcRenderer.invoke('launch-game', installPath);
  } catch (error) {
    console.error('Failed to launch game:', error);
    return false;
  }
};

export const getAppPath = async (): Promise<string> => {
  try {
    return await ipcRenderer.invoke('get-app-path');
  } catch (error) {
    console.error('Failed to get app path:', error);
    return '/';
  }
};

// Declare global window interface
declare global {
  interface Window {
    require?: (module: string) => any;
  }
}