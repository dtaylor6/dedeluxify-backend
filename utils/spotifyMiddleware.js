const axios = require('axios')

// Gets all of the album tracks and puts them in array req.tracks
const getAlbumTracks = async (req, res, next) => {
  const albumId = req.query.albumId

  if (albumId === '') {
    return res.status(400).send('No album id specified')
  }

  const tracks = []
  let spotifyResponse = await axios
    .get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        params: {
          limit: 50,
        },
        headers: {
          'Authorization': req.token,
        }
      }
    )
    .catch((error) => {
      next(error)
    })

  spotifyResponse.data.items.forEach(item => tracks.push(item))

  // Due to limit of 50, we may have to call Spotify API multiple times to get all album tracks
  while (spotifyResponse.data.next !== null && spotifyResponse.data.next !== undefined) {
    spotifyResponse = await axios
      .get(
        `${spotifyResponse.data.next}`, {
          params: {
            limit: 50,
          },
          headers: {
            'Authorization': req.token,
          }
        }
      )
      .catch((error) => {
        next(error)
      })

    spotifyResponse.data.items.forEach(item => tracks.push(item))
  }

  req.tracks = tracks
  next()
}

module.exports = {
  getAlbumTracks
}