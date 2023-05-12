const axios = require('axios')
const spotifyRouter = require('express').Router()

const getAlbumTracks = require('./spotifyMiddleware').getAlbumTracks

// Ensure a proper token is given for each request to this route
spotifyRouter.use((req, res, next) => {
  const auth = req.headers['authorization']

  if (auth === '') {
    return res.status(401).send('No Spotify auth token given in header')
  }
  else if (!auth.startsWith('Bearer ')) {
    return res.status(401).send('Malformatted Spotify auth token given in \
                                 header. Must be of format: Bearer <token>')
  }

  req.token = auth
  next()
})

spotifyRouter.get('/search', (req, res, next) => {
  const query = req.query.q

  // Prevent empty query request to Spotify API
  if (query === '') {
    return res.status(400).send('No search query')
  }

  axios
    .get(
      'https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'album'
        },
        headers: {
          'Authorization': req.token,
        }
      }
    )
    .then((response) => {
      res.status(200).json(response.data.albums.items)
    })
    .catch ((error) => {
      next(error)
    })
})

spotifyRouter.get('/play', [getAlbumTracks], async (req, res, next) => {
  console.log('Tracks', req.tracks)
})

module.exports = spotifyRouter