const axios = require('axios')
const spotifyRouter = require('express').Router()

spotifyRouter.get('/search', (req, res, next) => {
  const query = req.query.q
  const auth = req.headers['authorization']

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
          'Authorization': auth,
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

spotifyRouter.get('/play', (req, res, next) => {
  const uri = req.query.album_uri
  const auth = req.headers['authorization']

  if (uri === '') {
    return res.status(400).send('No album uri specified')
  }
})

module.exports = spotifyRouter