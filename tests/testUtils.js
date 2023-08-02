const SPOTIFY_CLIENT_ID = require('../utils/config.js').SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = require('../utils/config.js').SPOTIFY_SECRET;
const axios = require('axios');
const { sequelize } = require('../services/db');
const { findUser, findOrCreateUser } = require('../services/trackPreferencesService.js');

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

const clearTestDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  }
  catch (err) {
    console.log('Failed to clear database');
    console.log(err);
    return process.exit(1);
  }

  return null;
};

const addUser = async (spotifyId, displayName) => {
  const req = {
    spotifyUser: {
      id: spotifyId,
      display_name: displayName
    }
  };

  await findOrCreateUser(req, undefined, (msg) => msg ? console.log(msg) : 0);
  return req.user;
};

const getUser = async (spotifyId, displayName) => {
  const req = {
    spotifyUser: {
      id: spotifyId,
      display_name: displayName
    }
  };

  await findUser(req, undefined, (msg) => msg ? console.log(msg) : 0);
  return req.user;
};

module.exports = {
  getClientAuthToken,
  clearTestDatabase,
  addUser,
  getUser
};
