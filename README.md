# MMORPG Launcher

Un lanceur moderne pour MMORPG développé avec React, Electron et Vite.

## Fonctionnalités

- Authentification via Discord
- Téléchargement et mise à jour automatique des fichiers du jeu
- Suivi de progression des téléchargements
- Vérification de l'intégrité des fichiers
- Mode développeur pour simplifier les tests

## Configuration

### Variables d'environnement

Le projet utilise un fichier `.env` pour la configuration. Pour commencer, copiez le fichier `.env.example` :

```bash
cp .env.example .env
```

Puis modifiez les valeurs selon vos besoins :

```
# Mode Développement (true pour passer la vérification Discord)
VITE_DEV_MODE=false

# URLs de l'application
VITE_CDN_BASE_URL=https://cdn.soulsteal.online
VITE_MANIFEST_PATH=/manifest.json
VITE_FILES_PATH=/client

# Configuration Discord OAuth2
VITE_DISCORD_CLIENT_ID=your-client-id
VITE_DISCORD_CLIENT_SECRET=your-client-secret
VITE_DISCORD_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_DISCORD_API_URL=https://discord.com/api/v10
VITE_DISCORD_SERVER_ID=your-server-id
VITE_DISCORD_ROLE_ID=your-role-id

# Configuration du téléchargement
VITE_MAX_CONCURRENT_DOWNLOADS=3
```

**Note importante:** Toutes les variables d'environnement doivent commencer par `VITE_` pour être accessibles dans le code client. C'est une exigence de Vite.js.

### Mode Développement

Pour activer le mode développement et passer la vérification Discord, définissez `VITE_DEV_MODE=true` dans votre fichier `.env`. Cela vous permettra de tester l'application sans avoir besoin de configurer Discord.

## Installation

```bash
npm install
```

## Développement

```bash
npm run electron:dev
```

## Compilation

```bash
npm run electron:build
```

## Structure du projet

- `src/` - Code source React
  - `components/` - Composants React
  - `hooks/` - Hooks personnalisés
  - `pages/` - Pages de l'application
  - `services/` - Services pour l'API, l'authentification, etc.
  - `store/` - Gestion d'état global
  - `types/` - Interfaces TypeScript
- `electron/` - Code source Electron
  - `main.js` - Point d'entrée Electron
  - `preload.js` - Script de préchargement 