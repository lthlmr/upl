import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, GameFile, GameStatus } from '@/types';

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  gameStatus: GameStatus;
  installPath: string;
  gameFiles: GameFile[];
  currentVersion: string;
  remoteVersion: string;
  downloadProgress: {
    total: number;
    current: number;
    speed: number;
    file: string;
  };
  isUpdating: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'SET_INSTALL_PATH'; payload: string }
  | { type: 'SET_GAME_FILES'; payload: GameFile[] }
  | { type: 'SET_CURRENT_VERSION'; payload: string }
  | { type: 'SET_REMOTE_VERSION'; payload: string }
  | { type: 'SET_DOWNLOAD_PROGRESS'; payload: Partial<AppState['downloadProgress']> }
  | { type: 'SET_IS_UPDATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  gameStatus: 'not_installed',
  installPath: '',
  gameFiles: [],
  currentVersion: '',
  remoteVersion: '',
  downloadProgress: {
    total: 0,
    current: 0,
    speed: 0,
    file: '',
  },
  isUpdating: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_GAME_STATUS':
      return { ...state, gameStatus: action.payload };
    case 'SET_INSTALL_PATH':
      return { ...state, installPath: action.payload };
    case 'SET_GAME_FILES':
      return { ...state, gameFiles: action.payload };
    case 'SET_CURRENT_VERSION':
      return { ...state, currentVersion: action.payload };
    case 'SET_REMOTE_VERSION':
      return { ...state, remoteVersion: action.payload };
    case 'SET_DOWNLOAD_PROGRESS':
      return { 
        ...state, 
        downloadProgress: { 
          ...state.downloadProgress, 
          ...action.payload 
        } 
      };
    case 'SET_IS_UPDATING':
      return { ...state, isUpdating: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}