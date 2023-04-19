const axios = require('axios')
const discogsRouter = require('express').Router()
const config = require('../utils/config')


const discogs_client_id = config.DISCOGS_CLIENT_ID
const discogs_secret = config.DISCOGS_SECRET

const REQUEST_HEADERS = {
  'Authorization': `Discogs key=${discogs_client_id}, secret=${discogs_secret}`,
  'User-Agent': 'Dedeluxify/1.0'
}

discogsRouter.get('/search', (req, res) => {
  const query = req.query.q
  axios
    .get(
      'https://api.discogs.com/database/search', {
        params: {
          q: query,
          type: 'master',
        },
        headers: REQUEST_HEADERS
      }
    )
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch ((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    })
})

module.exports = discogsRouter