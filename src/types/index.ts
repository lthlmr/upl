// User related types
export interface User {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  isInServer: boolean;
  hasRole: boolean;
}

// Game status and configuration
export type GameStatus = 'not_installed' | 'installed' | 'update_available' | 'updating' | 'ready' | 'error';

export interface GameFile {
  path: string;
  hash: string;
  size: number;
  downloaded?: boolean;
}

export interface GameManifest {
  version: string;
  files: GameFile[];
}

// Discord authentication
export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUserResponse {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
}

export interface DiscordGuildMember {
  user: DiscordUserResponse;
  roles: string[];
  joined_at: string;
}

// IPC Messages
export interface IpcMessage {
  channel: string;
  data?: any;
}

// FTP Configuration
export interface FtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}

// Settings
export interface LauncherSettings {
  installPath: string;
  maxConcurrentDownloads: number;
  autoUpdate: boolean;
  autoLaunch: boolean;
  discordRPC: boolean;
}