import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Play, 
  Settings, 
  LogOut,
  Newspaper,
  HardDrive,
  X,
  ShoppingBag,
  MessageSquare,
  Gamepad2
} from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { useDiscordAuth } from '../hooks/useDiscordAuth';
import { useGameManager } from '../hooks/useGameManager';
import ProgressBar from '../components/common/ProgressBar';
import Background from '../components/common/Background';
import { Shield } from 'lucide-react';

const LauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { user, logout } = useDiscordAuth();
  const { 
    gameStatus, 
    currentVersion, 
    remoteVersion, 
    downloadProgress,
    isUpdating,
    error,
    checkForUpdates,
    installOrUpdate,
    launchGame,
    cancelUpdate,
    installPath,
    changeInstallPath
  } = useGameManager();
  
  const [showSettings, setShowSettings] = useState(false);
  const [localInstallPath, setLocalInstallPath] = useState(installPath);
  const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState(3);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [discordRPC, setDiscordRPC] = useState(true);
  
  // Mettre à jour localInstallPath quand installPath change
  useEffect(() => {
    setLocalInstallPath(installPath);
  }, [installPath]);
  
  // Vérifier les mises à jour au chargement
  useEffect(() => {
    checkForUpdates();
  }, []);
  
  // Formatage de la taille
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes.toFixed(0)} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };
  
  // Formatage de la vitesse
  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond < 1024) {
      return `${bytesPerSecond.toFixed(0)} B/s`;
    } else if (bytesPerSecond < 1024 * 1024) {
      return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
    } else {
      return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
    }
  };
  
  // Calcul du progrès
  const calculateProgress = () => {
    if (downloadProgress.total === 0) return 0;
    return (downloadProgress.current / downloadProgress.total) * 100;
  };

  // Gérer le changement de chemin d'installation
  const handlePathChange = async () => {
    try {
      await changeInstallPath();
    } catch (error) {
      console.error('Erreur lors du changement de chemin:', error);
    }
  };

  // Sauvegarder les paramètres
  const saveSettings = () => {
    // Enregistrer dans localStorage
    localStorage.setItem('maxConcurrentDownloads', maxConcurrentDownloads.toString());
    localStorage.setItem('autoUpdate', autoUpdate.toString());
    localStorage.setItem('discordRPC', discordRPC.toString());
    
    // Fermer la modale
    setShowSettings(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1A1F2E] flex flex-col">
      {/* Image d'arrière-plan */}
      <div className="fixed inset-0">
        <Background />
      </div>
      
      <div className="relative z-10 flex flex-col h-screen bg-gradient-to-b from-black/40 to-transparent">
        {/* Top navigation */}
        <div className="h-12 bg-black/40 backdrop-blur-sm flex items-center justify-end px-4 border-b border-purple-900/20">
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="flex items-center space-x-3 hover:bg-white/5 rounded-lg px-3 py-1.5 transition-colors"
            >
              <span className="text-gray-300">{user?.username}</span>
              <img 
                src={user?.avatar || 'https://via.placeholder.com/32'} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-purple-500/50"
              />
            </button>
            
            {/* Dropdown menu */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-black/90 backdrop-blur-sm border border-purple-500/20 rounded-lg shadow-xl">
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Main game area */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 p-6 flex flex-col">
              {/* DOFUS Logo */}
              <div className="mb-8 flex items-center relative">
                <img 
                  src="https://images.pexels.com/photos/7887135/pexels-photo-7887135.jpeg" 
                  alt="DOFUS" 
                  className="h-20 w-auto rounded-lg border-2 border-purple-500/30 shadow-xl transform hover:scale-105 transition-all duration-300"
                />
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">
                    DOFUS
                  </h1>
                  <p className="text-gray-400 mt-1">Préparez-vous pour l'aventure</p>
                </div>
              </div>
            
              {/* Téléchargement / Mise à jour */}
              {isUpdating && (
                <div className="mb-6 space-y-3 max-w-md bg-black/20 p-4 rounded-lg border border-purple-900/20">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{downloadProgress.file}</span>
                    <span>{formatSpeed(downloadProgress.speed)}</span>
                  </div>
                  
                  <ProgressBar 
                    progress={calculateProgress()} 
                    color="purple"
                    height="md"
                    showPercent
                  />
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatSize(downloadProgress.current)} / {formatSize(downloadProgress.total)}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={cancelUpdate}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Bouton principal */}
              <div className="mt-auto flex items-center space-x-4 max-w-md">
                {currentVersion !== remoteVersion && gameStatus !== 'updating' ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 bg-gradient-to-br from-purple-600 via-violet-500 to-purple-500 hover:from-purple-500 hover:via-violet-400 hover:to-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)] border-purple-400/30 transform hover:scale-105 transition-all duration-300"
                    leftIcon={<Download className="h-5 w-5" />}
                    onClick={installOrUpdate}
                  >
                    Mettre à jour
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 bg-gradient-to-br from-purple-600 via-violet-500 to-purple-500 hover:from-purple-500 hover:via-violet-400 hover:to-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)] border-purple-400/30 transform hover:scale-105 transition-all duration-300"
                    onClick={launchGame}
                    disabled={gameStatus !== 'ready' && gameStatus !== 'update_available'}
                    leftIcon={<Play className="h-5 w-5" />}
                  >
                    {gameStatus === 'ready' || gameStatus === 'update_available' ? 'Jouer' : 'Installer'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="fixed bottom-0 right-0 p-2">
          <div className="text-xs text-gray-400">
            {currentVersion !== remoteVersion ? (
              <>
                <span className="mr-2">Version {currentVersion || 'Non installé'}</span>
                <span className="text-purple-400">
                  (Mise à jour {remoteVersion} disponible)
                </span>
              </>
            ) : (
              <span>Version {currentVersion || 'Non installé'}</span>
            )}
          </div>
        </div>
        
        {/* Modale des paramètres */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#1A1F2E]/95 backdrop-blur-md rounded-xl border border-purple-500/20 shadow-lg overflow-hidden">
              {/* En-tête de la modale */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-transparent">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-purple-400 mr-2" />
                  <h2 className="text-lg font-bold text-white">Paramètres</h2>
                </div>
                <button 
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Corps de la modale */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Répertoire d'installation */}
                  <div>
                    <label className="text-white font-medium block mb-2">Répertoire d'installation</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={localInstallPath}
                        readOnly
                        className="bg-gray-800 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-700"
                      />
                      <Button
                        variant="outline"
                        onClick={handlePathChange}
                        leftIcon={<HardDrive className="h-4 w-4" />}
                      >
                        Parcourir
                      </Button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Emplacement où les fichiers du jeu seront installés
                    </p>
                  </div>
                  
                  {/* Téléchargements simultanés */}
                  <div>
                    <label className="text-white font-medium block mb-2">Téléchargements simultanés</label>
                    <select
                      value={maxConcurrentDownloads}
                      onChange={(e) => setMaxConcurrentDownloads(parseInt(e.target.value))}
                      className="bg-gray-800 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-700"
                    >
                      <option value={1}>1 (Plus lent mais plus stable)</option>
                      <option value={2}>2</option>
                      <option value={3}>3 (Recommandé)</option>
                      <option value={5}>5</option>
                      <option value={10}>10 (Plus rapide mais risque d'instabilité)</option>
                    </select>
                    <p className="text-gray-500 text-xs mt-1">
                      Nombre de fichiers à télécharger simultanément
                    </p>
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoUpdate"
                        checked={autoUpdate}
                        onChange={(e) => setAutoUpdate(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="autoUpdate" className="ml-2 text-gray-300">
                        Vérifier automatiquement les mises à jour
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="discordRPC"
                        checked={discordRPC}
                        onChange={(e) => setDiscordRPC(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="discordRPC" className="ml-2 text-gray-300">
                        Afficher statut dans Discord
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pied de la modale */}
              <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Déconnexion
                </Button>
                
                <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={saveSettings}
                  className="bg-purple-600 hover:bg-purple-500 border-purple-500/20"
                >
                  Sauvegarder
                </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LauncherPage;