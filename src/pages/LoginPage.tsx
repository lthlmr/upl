import React from 'react';
import { TowerControl as GameController, Shield, Gamepad2, Users } from 'lucide-react';
import Button from '../components/common/Button';
import { useDiscordAuth } from '../hooks/useDiscordAuth';
import config from '../services/configService';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useDiscordAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <GameController size={48} className="text-blue-500" />
            <div className="absolute inset-0 blur-lg opacity-60 bg-blue-500 rounded-full" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-white">MMORPG Launcher</h1>
        <p className="text-gray-400 text-center mb-8">
          {config.devMode ? 
            "Mode développement activé - Connexion simplifiée" :
            "Sign in with Discord to access the game"
          }
        </p>
        
        <div className="space-y-8">
          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-400" />
              <div>
                <h3 className="font-medium text-white">Secure Access</h3>
                <p className="text-sm text-gray-400">Authentication required to download and play</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Gamepad2 className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-400" />
              <div>
                <h3 className="font-medium text-white">Smart Updates</h3>
                <p className="text-sm text-gray-400">Automatically keep your game up to date</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Users className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-400" />
              <div>
                <h3 className="font-medium text-white">Community Integration</h3>
                <p className="text-sm text-gray-400">Connects with our Discord community</p>
              </div>
            </div>
          </div>
          
          {/* Login button */}
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={login}
            leftIcon={
              <svg viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor" />
              </svg>
            }
          >
            {config.devMode ? "Connexion automatique" : "Login with Discord"}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            {config.devMode ? 
              "Mode développement: l'authentification Discord est contournée." : 
              "You must be a member of our Discord server with the proper role to access the game."
            }
          </p>
          
          {config.devMode && (
            <div className="mt-2 px-3 py-2 bg-amber-900/50 border border-amber-700/50 rounded text-xs text-amber-200 text-center">
              Mode développeur activé dans le fichier .env
              <br />
              <code className="bg-black/30 px-1 py-0.5 rounded">VITE_DEV_MODE=true</code>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 MMORPG Studios. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;