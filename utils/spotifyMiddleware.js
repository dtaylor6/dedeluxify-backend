const axios = require('axios')

// Gets all of the album tracks and puts them in array req.tracks
const getAlbumTracks = async (req, res, next) => {
  const albumId = req.query.albumId
  const tracks = []

  try {
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

      spotifyResponse.data.items.forEach(item => tracks.push(item))
      return Promise.resolve(tracks)
    }
  }
  catch(error) {
    return Promise.reject(error)
  }
}

const getAlbumInfo = async (req, res, next) => {
  const albumId = req.query.albumId
  try {
    let spotifyResponse = await axios
      .get(
        `https://api.spotify.com/v1/albums/${albumId}`, {

          headers: {
            'Authorization': req.token,
          }
        }
      )

    return Promise.resolve(spotifyResponse.data)
  }
  catch(error) {
    return Promise.reject(error)
  }
}

module.exports = {
  getAlbumTracks,
  getAlbumInfo
}