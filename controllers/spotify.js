const axios = require('axios')
const spotifyRouter = require('express').Router()
const config = require('../utils/config')
const querystring = require('node:querystring')
const crypto = require('node:crypto')

const client_id = config.SPOTIFY_CLIENT_ID
const spotify_client_secret = config.SPOTIFY_SECRET
const port = config.PORT
const redirect_uri = `http://localhost:${port}/api/spotify/callback`

spotifyRouter.get('/login', (req, res) => {

  const state = crypto.randomBytes(64).toString('hex')
  const scope = 'streaming user-read-private user-read-email'

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

spotifyRouter.get('/callback', (req, res) => {
  const code = req.query.code

  axios
    .post('https://accounts.spotify.com/api/token', {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    })
    .then((response) => {
      console.log(response)
      const access_token = response.data.access_token
      res.status(201).json({
        access_token
      })
    })
})

module.exports = spotifyRouter