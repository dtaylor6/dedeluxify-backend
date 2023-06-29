import axios from 'axios';
import { Router } from 'express';
const trackPreferencesRouter = Router();

import { getAlbumTracks } from '../utils/spotifyUtils.js';

import { user, album_preference } from '../models/index.js';
import { findUser, findOrCreateUser } from '../utils/dbMiddleware.js';

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

const albumIdExtractor = (req, res, next) => {
  const uri = req.body.uri || req.query.uri;
  if (!uri) {
    return res.status(400).send('No Spotify URI given');
  }
  else if (!uri.startsWith('spotify:album:')) {
    return res.status(400).send('Spotify URI must be for an album');
  }

  req.albumId = uri.split(':').at(-1);
  if (req.albumId === '') {
    return res.status(400).send('No album id specified');
  }

  next();
};

// Get Spotify track list and corresponding preferences from db if they exist
trackPreferencesRouter.get('/', [albumIdExtractor, findUser], async (req, res, next) => {
  const albumId = req.albumId;
  const token = req.token;

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

trackPreferencesRouter.post('/', [albumIdExtractor, findOrCreateUser], async (req, res, next) => {
  const albumId = req.albumId;
  const numTracks = req.body.numTracks;
  const preferences = req.body.preferences;

  try {
    const newPreference = await album_preference.upsert({
      album_id: albumId,
      user_id: req.user.id,
      num_tracks: numTracks,
      track_preferences: preferences
    });
    res.status(200).json(newPreference);
  }
  catch(error) {
    next(error);
  }
});

export default trackPreferencesRouter;
