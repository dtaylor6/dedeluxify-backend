const SPOTIFY_CLIENT_ID = require('../utils/config.js').SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = require('../utils/config.js').SPOTIFY_SECRET;
const axios = require('axios');

// Will not be able to access user specific api routes with this token
const getClientAuthToken = async () => {
  try {
    const authResponse = await axios
      .post(
        'https://accounts.spotify.com/api/token',
        {
          grant_type: 'client_credentials'
        },
        {
          headers: {
            'Authorization': 'Basic ' + (new Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

    return authResponse.data.access_token;
  }
  catch(error) {
    console.log(error.response.status);
    console.log(error.response.data);
    return '';
  }
};

module.exports = {
  getClientAuthToken
};