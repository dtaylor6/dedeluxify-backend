const request = require('request')
const spotifyRouter = require('express').Router()
const config = require('../utils/config')
const querystring = require('node:querystring')
const crypto = require('node:crypto')

const spotify_client_id = config.SPOTIFY_CLIENT_ID
const spotify_client_secret = config.SPOTIFY_SECRET
const port = config.PORT
const frontend_port = config.FRONTEND_PORT

const redirect_uri = `http://localhost:${port}/api/spotify/callback`
const stateKey = 'spotify_auth_state'

spotifyRouter.get('/login', (req, res) => {
  const state = crypto.randomBytes(64).toString('hex')
  res.cookie(stateKey, state)

  const scope = 'streaming user-read-private user-read-email user-modify-playback-state'

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  )
})

spotifyRouter.get('/callback', (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    return res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  }
  else {
    res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
      },
      json: true
    }
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token

      return res.redirect(`http://localhost:${frontend_port}/?` +
        querystring.stringify({
          access_token: access_token
          //refresh_token: refresh_token
        }))
    }
    else {
      return res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        })
      )
    }
  })
})

module.exports = spotifyRouter