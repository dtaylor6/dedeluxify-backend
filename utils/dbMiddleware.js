import { user, album_preference } from '../models/index.js';

const findUser = async (req, res, next) => {
  const spotifyId = req.spotifyUser.id;
  if (!spotifyId) {
    return res.status(401).send('The server encountered an error authenticating through Spotify');
  }

  try {
    req.user = await user.findOne({ where: { spotify_id: spotifyId } });
  }
  catch(error) {
    next(error);
  }

  next();
};

const findOrCreateUser = async (req, res, next) => {
  const spotifyId = req.spotifyUser.id;
  const displayName = req.spotifyUser.display_name;
  if (!spotifyId) {
    return res.status(401).send('The server encountered an error authenticating through Spotify');
  }

  try {
    [req.user] = await user.findOrCreate({
      where: { spotify_id: spotifyId },
      defaults: {
        spotify_id: spotifyId,
        display_name: displayName
      }
    });
  }
  catch(error) {
    next(error);
  }

  next();
};

const getAlbumPreference = async (albumId, userId) => {
  try {
    const preference = await album_preference.findOne({
      where: {
        album_id: albumId,
        user_id: userId
      }
    });

    return Promise.resolve(preference);
  }
  catch(error) {
    return Promise.reject(error);
  }
};

export {
  findUser,
  findOrCreateUser,
  getAlbumPreference
};
