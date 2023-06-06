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

    spotifyResponse.data.items.forEach(item => tracks.push({ name: item.name, uri: item.uri }))

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

      spotifyResponse.data.items.forEach(item => tracks.push({ name: item.name, uri: item.uri }))
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

const playTracks = async (tracks, uri, token) => {
  const uris = tracks.map(track => track.uri)
  console.log(tracks)
  const queuedTracks = tracks.map(track => track.name)

  try {
    await axios
      .put(
        'https://api.spotify.com/v1/me/player/play',
        {
          'uris' : uris
        },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      )

    return Promise.resolve(queuedTracks)
  }
  catch(error) {
    return Promise.reject(error)
  }
}

const queueTracks = async (tracks, uri, token) => {
  const uris = tracks.map(track => track.uri)
  console.log(tracks)
  const queuedTracks = tracks.map(track => track.name)

  try {
    // Tracks have to be queued one at a time with current Spotify api
    for (let i = 0; i < uris.length; ++i) {
      await axios
        .post(
          'https://api.spotify.com/v1/me/player/queue',
          {},
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            },
            params: {
              'uri' : uris[i]
            }
          }
        )
      await new Promise(resolve => setTimeout(resolve, 500)) // Slow down api calls
    }
    return Promise.resolve(queuedTracks)
  }
  catch(error) {
    return Promise.reject(error)
  }
}

module.exports = {
  getAlbumTracks,
  getAlbumInfo,
  playTracks,
  queueTracks
}