import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { GameFile, GameManifest } from '../types';
import { ipcRenderer } from './electronService';
import config from './configService';

export interface DownloadProgress {
  total: number;
  current: number;
  speed: number;
  file: string;
}

interface DownloadOptions {
  maxConcurrent: number;
  onProgress: (progress: DownloadProgress) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

// Construction des URLs à partir de la configuration
const BASE_URL = config.cdn.baseUrl;
const MANIFEST_URL = `${BASE_URL}${config.cdn.manifestPath}`;
const FILES_BASE_URL = `${BASE_URL}${config.cdn.filesPath}`;

// Récupération du manifeste à distance via HTTP
export const getRemoteManifest = async (): Promise<GameManifest> => {
  try {
    // Téléchargement direct du manifeste via HTTP
    const response = await axios.get(MANIFEST_URL);
    return response.data;
  } catch (error) {
    console.error('Échec de récupération du manifeste distant:', error);
    throw new Error('Impossible de récupérer les informations de version du jeu');
  }
};

// Récupération du manifeste local
export const getLocalManifest = async (
  installPath: string
): Promise<GameManifest | null> => {
  try {
    const manifestPath = `${installPath}/manifest.json`;
    const exists = await ipcRenderer.invoke('file-exists', manifestPath);
    
    if (!exists) {
      return null;
    }
    
    const manifestContent = await ipcRenderer.invoke('read-file', manifestPath);
    return JSON.parse(manifestContent);
  } catch (error) {
    console.error('Échec de récupération du manifeste local:', error);
    return null;
  }
};

// Comparaison des manifestes et détermination des fichiers à mettre à jour
export const getFilesToUpdate = async (
  localManifest: GameManifest | null,
  remoteManifest: GameManifest,
  installPath: string
): Promise<GameFile[]> => {
  if (!localManifest) {
    // Première installation, télécharger tous les fichiers
    return remoteManifest.files;
  }
  
  const filesToUpdate: GameFile[] = [];
  
  for (const remoteFile of remoteManifest.files) {
    const localFile = localManifest.files.find((f: GameFile) => f.path === remoteFile.path);
    
    // Si le fichier n'existe pas localement ou si le hash est différent, ajouter à la liste de mise à jour
    if (!localFile || localFile.hash !== remoteFile.hash) {
      // Vérifier si le fichier existe et vérifier son hash
      const filePath = `${installPath}/${remoteFile.path}`;
      const fileExists = await ipcRenderer.invoke('file-exists', filePath);
      
      if (fileExists) {
        const fileContent = await ipcRenderer.invoke('read-file', filePath, 'binary');
        const fileHash = CryptoJS.MD5(fileContent).toString();
        
        if (fileHash === remoteFile.hash) {
          // Le fichier existe avec le hash correct, pas besoin de télécharger
          continue;
        }
      }
      
      filesToUpdate.push(remoteFile);
    }
  }
  
  return filesToUpdate;
};

// Téléchargement des fichiers via HTTP
export const downloadFiles = async (
  files: GameFile[],
  installPath: string,
  options: DownloadOptions
): Promise<void> => {
  const { maxConcurrent = config.downloads.maxConcurrent, onProgress, onComplete, onError } = options;
  
  // Création d'une file d'attente de fichiers à télécharger
  const queue = [...files];
  const activeDownloads = new Set<string>();
  let completedSize = 0;
  let totalSize = files.reduce((total, file) => total + file.size, 0);
  let isDownloading = true;
  
  // Mise à jour du manifeste local après chaque téléchargement de fichier
  const updateLocalManifest = async (
    file: GameFile,
    remoteManifest: GameManifest
  ): Promise<void> => {
    const localManifest = await getLocalManifest(installPath) || {
      version: remoteManifest.version,
      files: [],
    };
    
    // Mettre à jour ou ajouter le fichier dans le manifeste local
    const fileIndex = localManifest.files.findIndex((f: GameFile) => f.path === file.path);
    if (fileIndex >= 0) {
      localManifest.files[fileIndex] = file;
    } else {
      localManifest.files.push(file);
    }
    
    // Écrire le manifeste mis à jour
    const manifestPath = `${installPath}/manifest.json`;
    await ipcRenderer.invoke('write-file', manifestPath, JSON.stringify(localManifest, null, 2));
  };
  
  // Fonction pour télécharger un seul fichier
  const downloadFile = async (file: GameFile): Promise<void> => {
    if (!isDownloading) return;
    
    try {
      activeDownloads.add(file.path);
      
      // Mise à jour de la progression
      onProgress({
        total: totalSize,
        current: completedSize,
        speed: 0,
        file: file.path,
      });
      
      // Assurer que le répertoire existe
      const dirPath = file.path.substring(0, file.path.lastIndexOf('/'));
      if (dirPath) {
        await ipcRenderer.invoke('ensure-dir', `${installPath}/${dirPath}`);
      }
      
      // Télécharger le fichier
      const fileUrl = `${FILES_BASE_URL}/${file.path}`;
      const localPath = `${installPath}/${file.path}`;
      
      // Variables pour le suivi de la progression
      const startTime = Date.now();
      let lastUpdate = startTime;
      let lastBytes = 0;
      let downloadedBytes = 0;
      
      // Téléchargement avec suivi de progression
      const response = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          const now = Date.now();
          const timeDiff = now - lastUpdate;
          
          // Mettre à jour le calcul de vitesse toutes les 500ms
          if (timeDiff >= 500) {
            const byteDiff = progressEvent.loaded - lastBytes;
            const speed = byteDiff / (timeDiff / 1000);
            downloadedBytes = progressEvent.loaded;
            
            onProgress({
              total: totalSize,
              current: completedSize + downloadedBytes,
              speed,
              file: file.path,
            });
            
            lastUpdate = now;
            lastBytes = downloadedBytes;
          }
        }
      });
      
      // Écrire le fichier téléchargé
      await ipcRenderer.invoke('write-file', localPath, Buffer.from(response.data));
      
      // Le fichier a été téléchargé avec succès
      completedSize += file.size;
      activeDownloads.delete(file.path);
      
      // Vérifier le hash du fichier
      const fileContent = await ipcRenderer.invoke('read-file', localPath, 'binary');
      const fileHash = CryptoJS.MD5(fileContent).toString();
      
      if (fileHash !== file.hash) {
        throw new Error(`La vérification du hash a échoué pour ${file.path}`);
      }
      
      // Mettre à jour le manifeste local après un téléchargement réussi
      const remoteManifest = await getRemoteManifest();
      await updateLocalManifest(file, remoteManifest);
      
      // Traiter le fichier suivant dans la file d'attente
      processQueue();
    } catch (error: unknown) {
      console.error(`Échec du téléchargement de ${file.path}:`, error);
      activeDownloads.delete(file.path);
      
      if (isDownloading) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        onError(new Error(`Échec du téléchargement de ${file.path}: ${errorMessage}`));
        isDownloading = false;
      }
    }
  };
  
  // Traiter la file d'attente
  const processQueue = async (): Promise<void> => {
    if (!isDownloading) return;
    
    while (queue.length > 0 && activeDownloads.size < maxConcurrent) {
      const file = queue.shift();
      if (file) {
        downloadFile(file);
      }
    }
    
    if (queue.length === 0 && activeDownloads.size === 0) {
      onComplete();
    }
  };
  
  // Commencer le téléchargement
  processQueue();
  
  // Permettre l'annulation
  return new Promise<void>((resolve, reject) => {
    // Ajouter un moyen d'annuler les téléchargements en cours
    ipcRenderer.once('cancel-downloads', () => {
      isDownloading = false;
      reject(new Error('Téléchargements annulés'));
    });
  });
};

// Vérifier l'installation du jeu
export const verifyInstallation = async (
  installPath: string
): Promise<boolean> => {
  try {
    const manifestPath = `${installPath}/manifest.json`;
    const exists = await ipcRenderer.invoke('file-exists', manifestPath);
    
    if (!exists) {
      return false;
    }
    
    // Obtenir le manifeste
    const localManifest = await getLocalManifest(installPath);
    if (!localManifest) {
      return false;
    }
    
    // Vérifier chaque fichier
    for (const file of localManifest.files) {
      const filePath = `${installPath}/${file.path}`;
      const fileExists = await ipcRenderer.invoke('file-exists', filePath);
      
      if (!fileExists) {
        return false;
      }
      
      // Vérifier le hash
      const fileContent = await ipcRenderer.invoke('read-file', filePath, 'binary');
      const fileHash = CryptoJS.MD5(fileContent).toString();
      
      if (fileHash !== file.hash) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Échec de la vérification de l\'installation:', error);
    return false;
  }
};