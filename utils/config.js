require ('dotenv').config()

const PORT = process.env.PORT

const POSTGRES_SECRET = process.env.POSTGRES_SECRET

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET

module.exports = {
  PORT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET
}