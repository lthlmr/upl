// Configuration centralisée de l'application
// Ce service permet d'accéder aux variables d'environnement et aux configurations

// Vite expose les variables d'environnement sous import.meta.env
// Les variables doivent commencer par VITE_ pour être exposées au client
// https://vitejs.dev/guide/env-and-mode.html

// Fonction d'aide pour obtenir les variables d'environnement avec valeurs par défaut
const getEnv = (key: string, defaultValue: string = ''): string => {
  // Pour le développement local, on peut récupérer les variables du fichier .env
  const envKey = `VITE_${key}`;
  if (import.meta.env[envKey] !== undefined) {
    return import.meta.env[envKey] as string;
  }
  return defaultValue;
};

// Fonction d'aide pour convertir une chaîne en booléen
const getBoolEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnv(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Fonction d'aide pour convertir une chaîne en nombre
const getNumberEnv = (key: string, defaultValue: number = 0): number => {
  const value = getEnv(key);
  if (!value) return defaultValue;
  const num = parseInt(value);
  return isNaN(num) ? defaultValue : num;
};

// Configuration générale
export const config = {
  devMode: getBoolEnv('DEV_MODE', false),
  
  // URLs et chemins
  cdn: {
    baseUrl: getEnv('CDN_BASE_URL', 'https://cdn.soulsteal.online'),
    manifestPath: getEnv('MANIFEST_PATH', '/manifest.json'),
    filesPath: getEnv('FILES_PATH', '/client'),
  },
  
  // Configuration Discord
  discord: {
    clientId: getEnv('DISCORD_CLIENT_ID', ''),
    clientSecret: getEnv('DISCORD_CLIENT_SECRET', ''),
    redirectUri: getEnv('DISCORD_REDIRECT_URI', 'http://localhost:5173/auth/callback'),
    apiUrl: getEnv('DISCORD_API_URL', 'https://discord.com/api/v10'),
    serverId: getEnv('DISCORD_SERVER_ID', ''),
    roleId: getEnv('DISCORD_ROLE_ID', ''),
  },
  
  // Configuration du téléchargement
  downloads: {
    maxConcurrent: getNumberEnv('MAX_CONCURRENT_DOWNLOADS', 3),
  },
};

export default config; 