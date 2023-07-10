import { config } from 'dotenv';
config();

const NODE_ENV = process.env.NODE_ENV;

const PORT = process.env.PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const FRONTEND_URL = NODE_ENV === 'development'
  ? `http://localhost:${FRONTEND_PORT}`
  : process.env.FRONTEND_URL;

const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI + 'api/spotify/callback';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const DISCOGS_CLIENT_ID = process.env.DISCOGS_CLIENT_ID;
const DISCOGS_SECRET = process.env.DISCOGS_SECRET;

const DATABASE_URL = process.env.DATABASE_URL;

export {
  PORT,
  FRONTEND_PORT,
  FRONTEND_URL,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  DISCOGS_CLIENT_ID,
  DISCOGS_SECRET,
  DATABASE_URL,
  NODE_ENV
};
