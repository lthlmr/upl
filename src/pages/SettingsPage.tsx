import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  ChevronLeft, 
  HardDrive, 
  Download, 
  AlertCircle, 
  Terminal, 
  LayoutGrid, 
  Save,
  Shield,
  BrainCircuit
} from 'lucide-react';
import Button from '../components/common/Button';
import { useGameManager } from '../hooks/useGameManager';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    installPath, 
    changeInstallPath 
  } = useGameManager();
  
  const [settings, setSettings] = useState({
    maxConcurrentDownloads: 3,
    autoUpdate: true,
    autoLaunch: false,
    discordRPC: true,
  });
  
  const [activeTab, setActiveTab] = useState('installation');

  const handleSettingChange = (name: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to local storage
    localStorage.setItem('launcher_settings', JSON.stringify(settings));
    
    // Show success message
    alert('Paramètres sauvegardés avec succès');
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center py-3 px-6 bg-gray-900/90 backdrop-blur-md rounded-lg mb-6 border border-purple-900/40 shadow-lg shadow-purple-900/20">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/launcher')}
          leftIcon={<ChevronLeft size={18} />}
          className="mr-4"
        >
          Retour
        </Button>
        <div className="flex items-center">
          <div className="relative">
            <Settings size={24} className="text-purple-500 mr-3" />
            <div className="absolute inset-0 blur-md opacity-60 bg-purple-500 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
              Paramètres
            </span>
          </h1>
        </div>
      </header>
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Settings sidebar */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-4 lg:col-span-1 border border-purple-900/30 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4 px-2 border-b border-gray-800 pb-2">Catégories</h2>
          
          <div className="space-y-1">
            <button 
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeTab === 'installation' 
                  ? 'bg-purple-900/40 text-purple-300' 
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
              onClick={() => setActiveTab('installation')}
            >
              <HardDrive size={18} className="mr-2" />
              <span>Installation</span>
            </button>
            
            <button 
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeTab === 'updates' 
                  ? 'bg-purple-900/40 text-purple-300' 
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
              onClick={() => setActiveTab('updates')}
            >
              <Download size={18} className="mr-2" />
              <span>Mises à jour</span>
            </button>
            
            <button 
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeTab === 'interface' 
                  ? 'bg-purple-900/40 text-purple-300' 
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
              onClick={() => setActiveTab('interface')}
            >
              <LayoutGrid size={18} className="mr-2" />
              <span>Interface</span>
            </button>
            
            <button 
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeTab === 'advanced' 
                  ? 'bg-purple-900/40 text-purple-300' 
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
              onClick={() => setActiveTab('advanced')}
            >
              <Terminal size={18} className="mr-2" />
              <span>Avancé</span>
            </button>
            
            <button 
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeTab === 'about' 
                  ? 'bg-purple-900/40 text-purple-300' 
                  : 'hover:bg-gray-800/60 text-gray-300'
              }`}
              onClick={() => setActiveTab('about')}
            >
              <AlertCircle size={18} className="mr-2" />
              <span>À propos</span>
            </button>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-6 lg:col-span-4 border border-purple-900/30 shadow-lg">
          {activeTab === 'installation' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                Configuration d'installation
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-gray-300 block mb-2">Répertoire d'installation</label>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <input
                      type="text"
                      value={installPath}
                      readOnly
                      className="bg-gray-800/80 text-white px-3 py-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                    />
                    <Button
                      variant="outline"
                      onClick={changeInstallPath}
                      leftIcon={<HardDrive size={16} />}
                    >
                      Parcourir
                    </Button>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Emplacement où les fichiers du jeu seront installés
                  </p>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'updates' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                Paramètres de mise à jour
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-gray-300 block mb-2">Téléchargements simultanés</label>
                  <select
                    value={settings.maxConcurrentDownloads}
                    onChange={(e) => handleSettingChange('maxConcurrentDownloads', parseInt(e.target.value))}
                    className="bg-gray-800/80 text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  >
                    <option value={1}>1 (Plus lent mais plus stable)</option>
                    <option value={2}>2</option>
                    <option value={3}>3 (Recommandé)</option>
                    <option value={5}>5</option>
                    <option value={10}>10 (Plus rapide mais risque d'instabilité)</option>
                  </select>
                  <p className="text-gray-500 text-sm mt-1">
                    Nombre de fichiers à télécharger simultanément
                  </p>
                </div>
                
                <div className="py-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoUpdate"
                      checked={settings.autoUpdate}
                      onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="autoUpdate" className="ml-2 text-gray-300">
                      Vérifier automatiquement les mises à jour
                    </label>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Le lanceur recherchera les mises à jour au démarrage
                  </p>
                </div>
                
                <div className="py-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoLaunch"
                      checked={settings.autoLaunch}
                      onChange={(e) => handleSettingChange('autoLaunch', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="autoLaunch" className="ml-2 text-gray-300">
                      Lancer automatiquement après mise à jour
                    </label>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Démarrer le jeu automatiquement après installation des mises à jour
                  </p>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'interface' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                Personnalisation de l'interface
              </h2>
              
              <div className="space-y-6">
                <div className="py-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="discordRPC"
                      checked={settings.discordRPC}
                      onChange={(e) => handleSettingChange('discordRPC', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="discordRPC" className="ml-2 text-gray-300">
                      Afficher statut dans Discord
                    </label>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Afficher votre activité de jeu dans Discord
                  </p>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'advanced' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                Paramètres avancés
              </h2>
              
              <div className="bg-black/40 border border-amber-900/30 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-amber-500 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-amber-200 text-sm">
                    Ces paramètres sont destinés aux utilisateurs avancés. La modification de ces valeurs peut entraîner des problèmes de stabilité.
                  </p>
                </div>
              </div>
              
              <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50">
                <h3 className="text-gray-300 font-medium mb-4 flex items-center">
                  <BrainCircuit size={18} className="text-purple-400 mr-2" />
                  Options de débogage
                </h3>
                
                <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded border border-gray-700 text-sm">
                  Réinitialiser les paramètres
                </button>
              </div>
            </>
          )}
          
          {activeTab === 'about' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                À propos
              </h2>
              
              <div className="flex flex-col items-center justify-center bg-gray-800/30 rounded-lg p-6 border border-gray-800">
                <div className="relative mb-4">
                  <Shield size={64} className="text-purple-500" />
                  <div className="absolute inset-0 blur-md opacity-60 bg-purple-500 rounded-full" />
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
                  Epic Quest Launcher
                </h3>
                <p className="text-gray-400 mb-4">Version 1.2.0</p>
                
                <div className="text-center text-gray-500 text-sm">
                  <p>© 2025 Epic Quest Studios</p>
                  <p className="mt-2">Tous droits réservés</p>
                </div>
              </div>
            </>
          )}
          
          {/* Save button for sections that need it */}
          {(activeTab === 'updates' || activeTab === 'interface') && (
            <div className="mt-8 pt-4 border-t border-gray-800">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                leftIcon={<Save size={18} />}
              >
                Sauvegarder les paramètres
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;