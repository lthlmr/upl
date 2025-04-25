import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './store/AppContext';
import LoginPage from './pages/LoginPage';
import LauncherPage from './pages/LauncherPage';
import SettingsPage from './pages/SettingsPage';
import LoadingScreen from './components/common/LoadingScreen';
import Background from './components/common/Background';
import { useDiscordAuth } from './hooks/useDiscordAuth';
import config from './services/configService';

function App() {
  const { state } = useAppContext();
  const { isLoading } = useDiscordAuth();

  // Afficher la configuration en développement
  useEffect(() => {
    if (config.devMode) {
      console.log('🔧 Mode développement activé');
      console.log('📦 Configuration chargée:', config);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      <Background />
      <div className="relative z-10">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/launcher" 
            element={
              state.isAuthenticated ? <LauncherPage /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/settings" 
            element={
              state.isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="*" element={<Navigate to={state.isAuthenticated ? "/launcher" : "/login"} replace />} />
        </Routes>
      </div>
      
      {/* Indicateur de mode développement */}
      {config.devMode && (
        <div className="fixed bottom-2 right-2 px-2 py-1 bg-amber-800 text-amber-200 text-xs rounded opacity-70 z-50">
          Mode DEV
        </div>
      )}
    </div>
  );
}

export default App;