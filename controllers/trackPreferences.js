const axios = require('axios')
const trackPreferencesRouter = require('express').Router()

const { getAlbumTracks } = require('../utils/spotifyUtils')

// Fetch user email for database authentication
trackPreferencesRouter.use(async (req, res, next) => {
  const auth = req.headers['authorization']

  if (auth === '') {
    return res.status(401).send('No Spotify auth token given in header')
  }
  else if (!auth.startsWith('Bearer ')) {
    return res.status(401).send('Malformatted Spotify auth token given in \
                                 header. Must be of format: Bearer <token>')
  }
  else {
    req.token = auth
  }

  try {
    const spotifyUser = await axios
      .get(
        'https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': req.token,
          }
        }
      )

    req.spotifyUser = spotifyUser
  }
  catch(error) {
    next(error)
  }
  next()
})

trackPreferencesRouter.put('/set', async (req, res, next) => {
  const uri = req.query.uri
  const albumId = uri.split(':').at(-1) // Get album id from uri
  const token = req.token

  if (albumId === '') {
    return res.status(400).send('No album id specified')
  }

  try {
    // Execute both async functions in parallel
    const trackPromise = await Promise
      .all([
        getAlbumTracks(albumId, token),
        //getOriginalAlbumTracks(albumId, token)
      ])

    const spotifyTracks = trackPromise[0]
    //const discogsTracks = trackPromise[1]
    res.status(200).json(spotifyTracks)
  }
  catch(error) {
    next(error)
  }
})

module.exports = trackPreferencesRouter