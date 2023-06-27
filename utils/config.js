require ('dotenv').config();

const PORT = process.env.PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const DISCOGS_CLIENT_ID = process.env.DISCOGS_CLIENT_ID;
const DISCOGS_SECRET = process.env.DISCOGS_SECRET;

const DATABASE_URL = process.env.DATABASE_URL;

module.exports = {
  PORT,
  FRONTEND_PORT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  DISCOGS_CLIENT_ID,
  DISCOGS_SECRET,
  DATABASE_URL
};