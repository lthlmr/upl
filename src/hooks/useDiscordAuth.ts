import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import * as authService from '../services/authService';
import config from '../services/configService';

export const useDiscordAuth = () => {
  const { state, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Si le mode développement est activé, connecter automatiquement
        if (config.devMode) {
          console.log('Mode développement activé : connexion automatique');
          
          // Utiliser les données de développeur fictives
          const devUser = {
            id: 'dev_user_id',
            username: 'DevUser',
            avatar: null,
            discriminator: '0000',
            isInServer: true,
            hasRole: true,
          };
          
          // Stocker l'utilisateur pour la session
          localStorage.setItem('user', JSON.stringify(devUser));
          localStorage.setItem('auth_token', 'dev_token');
          
          dispatch({ type: 'SET_USER', payload: devUser });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          
          // Rediriger vers le lanceur
          if (location.pathname === '/login') {
            navigate('/launcher', { replace: true });
          }
          
          setIsLoading(false);
          return;
        }
        
        // Continuer avec la vérification d'authentification normale
        // Check if we have a code in the URL (OAuth callback)
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (code) {
          // Process the OAuth code
          const user = await authService.authenticate(code);
          
          // Store auth data
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('auth_token', 'bearer_token'); // Normally you'd store the actual token
          
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          
          // Clear the URL
          navigate('/launcher', { replace: true });
        } else {
          // Check if we have stored auth
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('auth_token');
          
          if (storedUser && storedToken) {
            // Validate the stored token
            try {
              // This would normally validate the token with Discord
              const user = JSON.parse(storedUser);
              
              dispatch({ type: 'SET_USER', payload: user });
              dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            } catch (error) {
              console.error('Invalid stored auth:', error);
              
              // Clear invalid auth
              localStorage.removeItem('user');
              localStorage.removeItem('auth_token');
              
              dispatch({ type: 'SET_USER', payload: null });
              dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            }
          } else {
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          }
        }
      } catch (error: unknown) {
        console.error('Auth error:', error);
        
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : String(error) });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [dispatch, location, navigate]);

  const login = () => {
    // Si en mode développement, on simule la connexion directement
    if (config.devMode) {
      const devUser = {
        id: 'dev_user_id',
        username: 'DevUser',
        avatar: null,
        discriminator: '0000',
        isInServer: true,
        hasRole: true,
      };
      
      localStorage.setItem('user', JSON.stringify(devUser));
      localStorage.setItem('auth_token', 'dev_token');
      
      dispatch({ type: 'SET_USER', payload: devUser });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      navigate('/launcher', { replace: true });
      return;
    }
    
    // Sinon, redirection vers Discord OAuth
    window.location.href = authService.getAuthUrl();
  };

  const logout = async () => {
    await authService.logout();
    
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    
    navigate('/login', { replace: true });
  };

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading,
    login,
    logout,
  };
};