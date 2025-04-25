import React, { useEffect, useState } from 'react';
import { 
  TowerControl as GameController, 
  Download, 
  Play, 
  Settings, 
  LogOut,
  RefreshCw,
  HardDrive,
  X
} from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { useDiscordAuth } from '../hooks/useDiscordAuth';
import { useGameManager } from '../hooks/useGameManager';
import ProgressBar from '../components/common/ProgressBar';

// Couleurs du thème
const colors = {
  dark: '#1E1E1E',
  darkGray: '#444444',
  accent: '#9333EA'
};

// Image d'arrière-plan
const backgroundImage = "https://via.placeholder.com/1920x1080/444444/FFFFFF?text=MMO+Background";

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
  
  // État pour les paramètres
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
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Image d'arrière-plan */}
      <div 
        className="fixed inset-0 z-0 opacity-50"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)'
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col h-screen">
        {/* Topbar simplifiée */}
        <header className="bg-black/70 py-2 px-4 border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <GameController className="h-7 w-7 text-purple-500 mr-2" />
              <h1 className="text-lg font-bold text-white">UpLauncher</h1>
            </div>
            
            {user ? (
              <div className="flex items-center">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/36'} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-full border border-purple-500"
                />
                <div className="ml-2 mr-3">
                  <p className="text-sm font-medium text-white">{user.username}</p>
                </div>
                
                <button 
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors text-red-500"
                  onClick={logout}
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                Connexion
              </Button>
            )}
          </div>
        </header>
        
        {/* Contenu principal - simplifié */}
        <main className="flex-1 container mx-auto flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black/70 backdrop-blur-md rounded-xl p-8 border border-gray-800">
            {/* Logo jeu */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <GameController size={64} className="text-purple-500" />
                <div className="absolute -inset-2 rounded-full blur-md bg-purple-600 opacity-30 z-[-1]"></div>
              </div>
            </div>
            
            {/* Version */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">UPLAUNCHER MMO</h1>
              
              <div className="text-sm text-gray-400 flex items-center justify-center">
                {currentVersion !== remoteVersion ? (
                  <>
                    <span className="mr-2">Version {currentVersion || 'Non installé'}</span>
                    <span className="text-yellow-500 flex items-center">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Mise à jour {remoteVersion} disponible
                    </span>
                  </>
                ) : (
                  <span>Version {currentVersion || 'Non installé'}</span>
                )}
              </div>
            </div>
            
            {/* Téléchargement / Mise à jour */}
            {isUpdating && (
              <div className="mb-8 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{downloadProgress.file}</span>
                  <span>{formatSpeed(downloadProgress.speed)}</span>
                </div>
                
                <ProgressBar 
                  progress={calculateProgress()} 
                  color="purple"
                  height="md"
                  showPercent
                />
                
                <div className="flex justify-between text-xs text-gray-500">
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
            <div className="flex flex-col items-center">
              {currentVersion !== remoteVersion && gameStatus !== 'updating' ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mb-4"
                  leftIcon={<Download className="h-5 w-5" />}
                  onClick={installOrUpdate}
                >
                  Mettre à jour
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mb-4"
                  onClick={launchGame}
                  disabled={gameStatus !== 'ready' && gameStatus !== 'update_available'}
                  leftIcon={<Play className="h-5 w-5" />}
                >
                  {gameStatus === 'ready' || gameStatus === 'update_available' ? 'Jouer' : 'Installer'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                leftIcon={<Settings className="h-4 w-4" />}
                onClick={() => setShowSettings(true)}
              >
                Paramètres
              </Button>
            </div>
          </div>
        </main>
        
        {/* Modale des paramètres */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-black/90 backdrop-blur-md rounded-xl border border-gray-800 shadow-lg overflow-hidden">
              {/* En-tête de la modale */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-purple-500 mr-2" />
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
              <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                  className="mr-2"
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={saveSettings}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LauncherPage;