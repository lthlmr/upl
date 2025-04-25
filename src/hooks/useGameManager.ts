import { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import * as updateService from '../services/updateService';
import * as electronService from '../services/electronService';
import { GameStatus, GameFile } from '../types';
import config from '../services/configService';

export const useGameManager = () => {
  const { state, dispatch } = useAppContext();
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);

  // Load initial state
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        // Load install path from settings
        const installPath = localStorage.getItem('installPath');
        if (installPath) {
          dispatch({ type: 'SET_INSTALL_PATH', payload: installPath });
          
          // Check if game is installed
          const isInstalled = await updateService.verifyInstallation(installPath);
          
          if (isInstalled) {
            // Get local manifest
            const localManifest = await updateService.getLocalManifest(installPath);
            
            if (localManifest) {
              dispatch({ type: 'SET_CURRENT_VERSION', payload: localManifest.version });
              dispatch({ type: 'SET_GAME_FILES', payload: localManifest.files });
              dispatch({ type: 'SET_GAME_STATUS', payload: 'installed' });
            } else {
              dispatch({ type: 'SET_GAME_STATUS', payload: 'not_installed' });
            }
          } else {
            dispatch({ type: 'SET_GAME_STATUS', payload: 'not_installed' });
          }
        } else {
          // Set default install path
          const appPath = await electronService.getAppPath();
          const defaultPath = `${appPath}/GameData`;
          
          dispatch({ type: 'SET_INSTALL_PATH', payload: defaultPath });
          dispatch({ type: 'SET_GAME_STATUS', payload: 'not_installed' });
        }
      } catch (error) {
        console.error('Failed to load initial state:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize launcher' });
      }
    };
    
    loadInitialState();
  }, [dispatch]);

  // Check for updates
  const checkForUpdates = async () => {
    if (isCheckingForUpdates || state.isUpdating) return;
    
    setIsCheckingForUpdates(true);
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Get remote manifest
      const remoteManifest = await updateService.getRemoteManifest();
      dispatch({ type: 'SET_REMOTE_VERSION', payload: remoteManifest.version });
      
      if (state.gameStatus === 'not_installed') {
        // Game is not installed, set all files for download
        dispatch({ type: 'SET_GAME_FILES', payload: remoteManifest.files });
        dispatch({ type: 'SET_GAME_STATUS', payload: 'not_installed' });
      } else {
        // Game is installed, check for updates
        const localManifest = await updateService.getLocalManifest(state.installPath);
        
        if (localManifest && localManifest.version === remoteManifest.version) {
          // Versions match, verify files
          const filesToUpdate = await updateService.getFilesToUpdate(
            localManifest,
            remoteManifest,
            state.installPath
          );
          
          if (filesToUpdate.length > 0) {
            // Some files need to be updated
            dispatch({ type: 'SET_GAME_FILES', payload: filesToUpdate });
            dispatch({ type: 'SET_GAME_STATUS', payload: 'update_available' });
          } else {
            // No updates needed
            dispatch({ type: 'SET_GAME_STATUS', payload: 'ready' });
          }
        } else {
          // Version mismatch, update available
          const filesToUpdate = await updateService.getFilesToUpdate(
            localManifest,
            remoteManifest,
            state.installPath
          );
          
          dispatch({ type: 'SET_GAME_FILES', payload: filesToUpdate });
          dispatch({ type: 'SET_GAME_STATUS', payload: 'update_available' });
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check for updates' });
    } finally {
      setIsCheckingForUpdates(false);
    }
  };

  // Install or update the game
  const installOrUpdate = async () => {
    if (state.isUpdating) return;
    
    dispatch({ type: 'SET_IS_UPDATING', payload: true });
    dispatch({ type: 'SET_GAME_STATUS', payload: 'updating' });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Get remote manifest
      const remoteManifest = await updateService.getRemoteManifest();
      
      // Ensure installation directory exists
      await electronService.ipcRenderer.invoke('ensure-dir', state.installPath);
      
      // Start downloading files
      const filesToUpdate = state.gameFiles.length > 0 
        ? state.gameFiles 
        : remoteManifest.files;
      
      await updateService.downloadFiles(
        filesToUpdate,
        state.installPath,
        {
          maxConcurrent: config.downloads.maxConcurrent,
          onProgress: (progress) => {
            dispatch({ 
              type: 'SET_DOWNLOAD_PROGRESS', 
              payload: progress 
            });
          },
          onComplete: () => {
            // Save install path to settings
            localStorage.setItem('installPath', state.installPath);
            
            // Update state
            dispatch({ type: 'SET_CURRENT_VERSION', payload: remoteManifest.version });
            dispatch({ type: 'SET_GAME_STATUS', payload: 'ready' });
            dispatch({ type: 'SET_IS_UPDATING', payload: false });
          },
          onError: (error) => {
            console.error('Download error:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            dispatch({ type: 'SET_GAME_STATUS', payload: 'error' });
            dispatch({ type: 'SET_IS_UPDATING', payload: false });
          },
        }
      );
    } catch (error) {
      console.error('Failed to install/update:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to install or update game' });
      dispatch({ type: 'SET_GAME_STATUS', payload: 'error' });
      dispatch({ type: 'SET_IS_UPDATING', payload: false });
    }
  };

  // Launch the game
  const launchGame = async () => {
    try {
      // Verify the installation before launching
      const isInstalled = await updateService.verifyInstallation(state.installPath);
      
      if (!isInstalled) {
        dispatch({ type: 'SET_ERROR', payload: 'Game files are missing or corrupted' });
        dispatch({ type: 'SET_GAME_STATUS', payload: 'error' });
        return;
      }
      
      // Launch the game
      const success = await electronService.launchGame(state.installPath);
      
      if (!success) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to launch game' });
      }
    } catch (error) {
      console.error('Failed to launch game:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to launch game' });
    }
  };

  // Cancel the update process
  const cancelUpdate = () => {
    if (state.isUpdating) {
      electronService.ipcRenderer.send('cancel-downloads');
      dispatch({ type: 'SET_IS_UPDATING', payload: false });
      
      // Determine the appropriate status based on the current state
      const newStatus: GameStatus = state.currentVersion 
        ? 'installed' 
        : 'not_installed';
      
      dispatch({ type: 'SET_GAME_STATUS', payload: newStatus });
    }
  };

  // Change installation directory
  const changeInstallPath = async () => {
    try {
      const newPath = await electronService.selectDirectory();
      
      if (newPath) {
        dispatch({ type: 'SET_INSTALL_PATH', payload: newPath });
        
        // Check if game is already installed in the new location
        const isInstalled = await updateService.verifyInstallation(newPath);
        
        if (isInstalled) {
          // Game is already installed at this location
          const localManifest = await updateService.getLocalManifest(newPath);
          
          if (localManifest) {
            dispatch({ type: 'SET_CURRENT_VERSION', payload: localManifest.version });
            dispatch({ type: 'SET_GAME_FILES', payload: localManifest.files });
            dispatch({ type: 'SET_GAME_STATUS', payload: 'installed' });
            
            // Save the new path
            localStorage.setItem('installPath', newPath);
          }
        } else {
          // New location does not have the game installed
          dispatch({ type: 'SET_GAME_STATUS', payload: 'not_installed' });
          dispatch({ type: 'SET_CURRENT_VERSION', payload: '' });
          dispatch({ type: 'SET_GAME_FILES', payload: [] });
        }
      }
    } catch (error) {
      console.error('Failed to change install path:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to change installation directory' });
    }
  };

  return {
    installPath: state.installPath,
    gameStatus: state.gameStatus,
    currentVersion: state.currentVersion,
    remoteVersion: state.remoteVersion,
    downloadProgress: state.downloadProgress,
    isUpdating: state.isUpdating,
    isCheckingForUpdates,
    error: state.error,
    files: state.gameFiles,
    checkForUpdates,
    installOrUpdate,
    launchGame,
    cancelUpdate,
    changeInstallPath,
  };
};