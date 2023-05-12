const axios = require('axios')
const config = require('./config')

const discogs_client_id = config.DISCOGS_CLIENT_ID
const discogs_secret = config.DISCOGS_SECRET

const REQUEST_HEADERS = {
  'Authorization': `Discogs key=${discogs_client_id}, secret=${discogs_secret}`,
  'User-Agent': 'Dedeluxify/1.0'
}

const getOriginalAlbumTracks = async (req, res, next) => {
  const query = req.query.q // TODO: Change this param

  const tracks = []
  try {
    // TODO: change where this information is acquired from Discogs
    const discogsResponse = await axios
      .get(
        'https://api.discogs.com/database/search', {
          params: {
            q: query,
            type: 'master',
          },
          headers: REQUEST_HEADERS
        }
      )

    discogsResponse.data.items.forEach(item => tracks.push(item))
  }
  catch(error) {
    next(error)
  }

  req.discogsTracks = tracks
  next()
}

module.exports = getOriginalAlbumTracks