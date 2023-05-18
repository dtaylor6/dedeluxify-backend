const axios = require('axios')

const getAlbumTracks = async (albumId, token) => {
  try {
    const tracks = []
    let spotifyResponse = await axios
      .get(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`, {
          params: {
            limit: 50,
          },
          headers: {
            'Authorization': token,
          }
        }
      )

    spotifyResponse.data.items.forEach(item => tracks.push({ name: item.name, id: item.id }))

    // Due to limit of 50, we may have to call Spotify API multiple times to get all album tracks
    while (spotifyResponse.data.next !== null && spotifyResponse.data.next !== undefined) {
      spotifyResponse = await axios
        .get(
          `${spotifyResponse.data.next}`, {
            params: {
              limit: 50,
            },
            headers: {
              'Authorization': token,
            }
          }
        )

      spotifyResponse.data.items.forEach(item => tracks.push({ name: item.name, id: item.id }))
    }

    return Promise.resolve(tracks)
  }
  catch(error) {
    return Promise.reject(error)
  }
}

const getAlbumInfo = async (albumId, token) => {
  try {
    let spotifyResponse = await axios
      .get(
        `https://api.spotify.com/v1/albums/${albumId}`, {

          headers: {
            'Authorization': token,
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