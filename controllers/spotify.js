const axios = require('axios')
const { getOriginalAlbumTracks } = require('../utils/discogs')
const spotifyRouter = require('express').Router()

const { getAlbumTracks, queueTracks } = require('../utils/spotifyUtils')
const { combineTrackLists } = require('../utils/stringUtils')

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

spotifyRouter.get('/play', async (req, res, next) => {
  const albumId = req.query.albumId
  const token = req.token

  if (albumId === '') {
    return res.status(400).send('No album id specified')
  }

  try {
    // Execute both async functions in parallel
    const trackPromise = await Promise
      .all([
        getAlbumTracks(albumId, token),
        getOriginalAlbumTracks(albumId, token)
      ])

    console.log(trackPromise)
    // May return an empty array
    const originalTracks = combineTrackLists(trackPromise[0], trackPromise[1])
    console.log('Combined:', originalTracks)

    // const response = (originalTracks.length > 0) ?
    //   await queueTracks(originalTracks) :
    //   await queueTracks(trackPromise[0])
  }
  catch(error) {
    next(error)
  }

  res.status(200).send()
})

module.exports = spotifyRouter