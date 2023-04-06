require ('dotenv').config()

const PORT = process.env.PORT
const FRONTEND_PORT = process.env.FRONTEND_PORT

const POSTGRES_SECRET = process.env.POSTGRES_SECRET

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET

const DISCOGS_CLIENT_ID = process.env.DISCOGS_CLIENT_ID
const DISCOGS_SECRET = process.env.DISCOGS_SECRET

module.exports = {
  PORT,
  FRONTEND_PORT,
  POSTGRES_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  DISCOGS_CLIENT_ID,
  DISCOGS_SECRET
}