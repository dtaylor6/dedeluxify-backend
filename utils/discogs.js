const axios = require('axios')
const config = require('./config')

const getAlbumInfo = require('./spotifyMiddleware').getAlbumInfo

const discogs_client_id = config.DISCOGS_CLIENT_ID
const discogs_secret = config.DISCOGS_SECRET

const REQUEST_HEADERS = {
  'Authorization': `Discogs key=${discogs_client_id}, secret=${discogs_secret}`,
  'User-Agent': 'Dedeluxify/1.0'
}

const getOriginalAlbumTracks = async (albumId, token) => {
  const tracks = []
  try {
    const albumInfo = await getAlbumInfo(albumId, token)
    //console.log('Spotify album info in getOriginalTracks',albumInfo)
    const artist = albumInfo.artists[0].name
    const album = albumInfo.name
    console.log(`${artist} - ${album}`)

    const discogsResponse = await axios
      .get(
        'https://api.discogs.com/database/search', {
          params: {
            artist,
            type: 'master'
          },
          headers: REQUEST_HEADERS
        }
      )

    //console.log('Discogs album info in getOriginalTracks',discogsResponse.data.results[0])
    discogsResponse.data.results.forEach(result => tracks.push(result))
    return Promise.resolve(tracks)
  }
  catch(error) {
    return Promise.reject(error)
  }
}

module.exports = {
  getOriginalAlbumTracks
}