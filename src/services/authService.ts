import axios from 'axios';
import { DiscordTokenResponse, DiscordUserResponse, DiscordGuildMember, User } from '../types';
import config from './configService';

// Discord OAuth2 configuration from config
const CLIENT_ID = config.discord.clientId;
const CLIENT_SECRET = config.discord.clientSecret;
const REDIRECT_URI = config.discord.redirectUri;
const DISCORD_API = config.discord.apiUrl;
const TARGET_SERVER_ID = config.discord.serverId;
const REQUIRED_ROLE_ID = config.discord.roleId;
const DEV_MODE = config.devMode;

// Generate the OAuth2 URL for Discord login
export const getAuthUrl = (): string => {
  const scopes = ['identify', 'guilds', 'guilds.members.read'];
  return `${DISCORD_API}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}`;
};

// Exchange authorization code for token
export const exchangeCode = async (code: string): Promise<DiscordTokenResponse> => {
  if (DEV_MODE) {
    // En mode développement, retourner un token fictif
    return {
      access_token: 'dev_access_token',
      token_type: 'Bearer',
      expires_in: 604800,
      refresh_token: 'dev_refresh_token',
      scope: 'identify guilds guilds.members.read'
    };
  }

  try {
    const response = await axios.post(
      `${DISCORD_API}/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw new Error('Failed to authenticate with Discord');
  }
};

// Refresh the access token
export const refreshToken = async (refreshToken: string): Promise<DiscordTokenResponse> => {
  if (DEV_MODE) {
    // En mode développement, retourner un token fictif
    return {
      access_token: 'dev_access_token',
      token_type: 'Bearer',
      expires_in: 604800,
      refresh_token: 'dev_refresh_token',
      scope: 'identify guilds guilds.members.read'
    };
  }

  try {
    const response = await axios.post(
      `${DISCORD_API}/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh auth token');
  }
};

// Get the user information
export const getUserInfo = async (accessToken: string): Promise<DiscordUserResponse> => {
  if (DEV_MODE) {
    // En mode développement, retourner un utilisateur fictif
    return {
      id: 'dev_user_id',
      username: 'DevUser',
      avatar: null,
      discriminator: '0000',
    };
  }

  try {
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw new Error('Failed to get user information');
  }
};

// Check if user is a member of the target server
export const checkServerMembership = async (
  accessToken: string,
  userId: string
): Promise<boolean> => {
  if (DEV_MODE) {
    // En mode développement, retourner true
    return true;
  }

  try {
    await axios.get(`${DISCORD_API}/guilds/${TARGET_SERVER_ID}/members/${userId}`, {
      headers: {
        Authorization: `Bot ${CLIENT_SECRET}`, // Note: This requires a bot token
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error checking server membership:', error);
    return false;
  }
};

// Check if user has the required role
export const checkUserRole = async (
  accessToken: string,
  userId: string
): Promise<boolean> => {
  if (DEV_MODE) {
    // En mode développement, retourner true
    return true;
  }

  try {
    const response = await axios.get(`${DISCORD_API}/guilds/${TARGET_SERVER_ID}/members/${userId}`, {
      headers: {
        Authorization: `Bot ${CLIENT_SECRET}`, // Note: This requires a bot token
      },
    });
    
    const member: DiscordGuildMember = response.data;
    return member.roles.includes(REQUIRED_ROLE_ID);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

// Complete authentication flow and get user details with verification
export const authenticate = async (code: string): Promise<User> => {
  if (DEV_MODE) {
    // En mode développement, retourner un utilisateur authentifié fictif
    console.log('Mode développement activé : authentification ignorée');
    return {
      id: 'dev_user_id',
      username: 'DevUser',
      avatar: null,
      discriminator: '0000',
      isInServer: true,
      hasRole: true,
    };
  }

  const tokenResponse = await exchangeCode(code);
  const userInfo = await getUserInfo(tokenResponse.access_token);
  
  const isInServer = await checkServerMembership(tokenResponse.access_token, userInfo.id);
  if (!isInServer) {
    throw new Error('You must be a member of the server to use this launcher');
  }
  
  const hasRole = await checkUserRole(tokenResponse.access_token, userInfo.id);
  if (!hasRole) {
    throw new Error('You must have the required role to use this launcher');
  }
  
  return {
    id: userInfo.id,
    username: userInfo.username,
    avatar: userInfo.avatar,
    discriminator: userInfo.discriminator,
    isInServer,
    hasRole,
  };
};

// Logout
export const logout = async (): Promise<void> => {
  // Clear local storage or electron-store
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};