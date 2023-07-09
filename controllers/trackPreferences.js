import { Router } from 'express';
const trackPreferencesRouter = Router();

import { album_preference } from '../models/index.js';
import {
  getSpotifyUser,
  findUser,
  findOrCreateUser,
  findDbPreference
} from '../utils/dbMiddleware.js';

// Fetch Spotify id with token for database authentication
trackPreferencesRouter.use(getSpotifyUser);

const albumIdExtractor = (req, res, next) => {
  console.log('uri: ', req.query.uri);
  console.log('typeof uri', typeof req.query.uri);
  const uri = req.body.uri || req.query.uri;
  if (!uri) {
    return res.status(400).send('No Spotify URI given');
  }
  else if (!uri.startsWith('spotify:album:')) {
    return res.status(400).send('Spotify URI must be for an album');
  }

  req.albumId = uri.toString().split(':').at(-1);
  if (req.albumId === '') {
    return res.status(400).send('No album id specified');
  }

  next();
};

// Get Spotify track list and corresponding preferences from db if they exist
trackPreferencesRouter.get('/', [albumIdExtractor, findUser], async (req, res, next) => {
  try {
    const preferred = await findDbPreference(req.albumId, req.user.id, req.token);
    res.status(200).json(preferred.tracks);
  }
  catch(error) {
    next(error);
  }
});

// Post/update track preferences for the corresponding Spotify album
trackPreferencesRouter.post('/', [albumIdExtractor, findOrCreateUser], async (req, res, next) => {
  try {
    // Create or update album preference
    const [newPreference] = await album_preference.upsert({
      album_id: req.albumId,
      user_id: req.user.id,
      num_tracks: req.body.numTracks,
      track_preferences: req.body.preferences
    });
    res.status(200).json(newPreference);
  }
  catch(error) {
    next(error);
  }
});

export default trackPreferencesRouter;
