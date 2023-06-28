import { config } from 'dotenv';
config();

export const PORT = process.env.PORT;
export const FRONTEND_PORT = process.env.FRONTEND_PORT;

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

export const DISCOGS_CLIENT_ID = process.env.DISCOGS_CLIENT_ID;
export const DISCOGS_SECRET = process.env.DISCOGS_SECRET;

export const DATABASE_URL = process.env.DATABASE_URL;
