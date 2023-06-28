import axios from 'axios';
import { Router } from 'express';
const trackPreferencesRouter = Router();

import { getAlbumTracks } from '../utils/spotifyUtils.js';

import user from '../models/index.js';

// Fetch Spotify id with token for database authentication
trackPreferencesRouter.use(async (req, res, next) => {
  const auth = req.headers['authorization'];

  if (auth === '') {
    return res.status(403).send('No Spotify auth token given in header');
  }
  else if (!auth.startsWith('Bearer ')) {
    return res.status(403).send('Malformatted Spotify auth token given in header. Must be of format: Bearer <token>');
  }
  else {
    req.token = auth;
  }

  try {
    const spotifyResponse = await axios
      .get(
        'https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': req.token,
          }
        }
      );

    req.spotifyUser = spotifyResponse.data;
  }
  catch(error) {
    next(error);
  }
  next();
});

const findUser = async (req, res, next) => {
  const spotifyId = req.spotifyUser.id;
  if (!spotifyId) {
    res.status(401).send('The server encountered an error authenticating through Spotify');
  }

  try {
    req.user = await user.findOne({ where: { spotify_id: spotifyId } });
  }
  catch(error) {
    next(error);
  }

  next();
};

// Get Spotify track list and corresponding preferences from db if they exist
trackPreferencesRouter.get('/', findUser, async (req, res, next) => {
  const uri = req.query.uri;
  const token = req.token;

  // Get album id from uri
  const albumId = uri.split(':').at(-1);

  if (albumId === '') {
    return res.status(400).send('No album id specified');
  }

  try {
    // Execute both async functions in parallel
    const trackPromise = await Promise
      .all([
        getAlbumTracks(albumId, token),
        //getOriginalAlbumTracks(albumId, token)
      ]);

    const spotifyTracks = trackPromise[0];
    //const discogsTracks = trackPromise[1]
    res.status(200).json(spotifyTracks);
  }
  catch(error) {
    next(error);
  }
});

trackPreferencesRouter.post('/', async (req, res, next) => {
  const spotifyId = req.spotifyUser.id;
  const displayName = req.spotifyUser.display_name;
  if (!spotifyId) {
    res.status(401).send('The server encountered an error authenticating through Spotify');
  }

  try {
    req.user = await user.findOrCreate({
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

  const uris = req.body.uris;
  res.status(200).send();
});

export default trackPreferencesRouter;
