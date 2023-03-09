import axios from 'axios'

const spotifyRouter = require('express').Router()
const config = require('../utils/config')
const querystring = require('node:querystring')
const crypto = require('node:crypto')

const client_id = config.SPOTIFY_CLIENT_ID
const port = config.PORT
const redirect_uri = `http://localhost:${port}/spotify/callback`


spotifyRouter.get('/login', function(req, res) {

  const state = crypto.randomBytes(64).toString('hex')
  const scope = 'user-read-private user-read-email'

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  )
})

spotifyRouter.get('/', async (request, response) => {
  const songs = await axios.get()
  response.json(songs)
})

module.exports = spotifyRouter