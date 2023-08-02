import { Router } from 'express';
const trackPreferencesRouter = Router();

import { album_preference } from '../models/index.js';
import {
  getSpotifyUser,
  findUser,
  findOrCreateUser,
  findDbPreference,
  deleteDbPreference,
  deleteUser
} from '../services/trackPreferencesService.js';

// Fetch Spotify id with token for database authentication
trackPreferencesRouter.use(getSpotifyUser);

const albumIdExtractor = (req, res, next) => {
  const uri = req.body.uri || req.query.uri;
  if (!uri) {
    return res.status(400).send('No Spotify URI given');
  }
  else if (!uri.startsWith('spotify:album:')) {
    return res.status(400).send('Spotify URI must be for an album');
  }

  req.albumId = String(uri).split(':').at(-1);
  if (req.albumId === '') {
    return res.status(400).send('No album id specified');
  }

  next();
};

// Get Spotify track list and corresponding preferences from db if they exist
trackPreferencesRouter.get('/', [albumIdExtractor], async (req, res, next) => {
  try {
    req.user = await findUser(req.spotifyUser.id);
    const userId = req.user ? req.user.id : -1;
    const preferred = await findDbPreference(req.albumId, userId, req.token);
    return res.status(200).json(preferred.tracks);
  }
  catch(error) {
    next(error);
  }
});

// Post/update track preferences for the corresponding Spotify album
trackPreferencesRouter.post('/', [albumIdExtractor], async (req, res, next) => {
  try {
    req.user = await findOrCreateUser(req.spotifyUser.id, req.spotifyUser.display_name);
    const userId = req.user ? req.user.id : -1;
    if (userId < 0) {
      // Invalid id
      return res.status(500).send('User could not be found in preference database');
    }

    // Create or update album preference
    const [newPreference] = await album_preference.upsert({
      album_id: req.albumId,
      user_id: userId,
      num_tracks: req.body.numTracks,
      track_preferences: req.body.preferences
    });
    return res.status(200).json(newPreference);
  }
  catch(error) {
    next(error);
  }
});

// Delete track preferences for the corresponding Spotify album
trackPreferencesRouter.delete('/', [albumIdExtractor], async (req, res, next) => {
  try {
    req.user = await findUser(req.spotifyUser.id);
    const userId = req.user ? req.user.id : -1;
    if (userId < 0) {
      // Invalid id
      return res.status(200).send('User is already deleted or could not be found');
    }
    await deleteDbPreference(req.albumId, userId);
    res.status(200).send();
  }
  catch(error) {
    next(error);
  }
});

// Delete user and all of their album preferences
trackPreferencesRouter.delete('/user', async (req, res, next) => {
  try {
    req.user = await findUser(req.spotifyUser.id);
    const userId = req.user ? req.user.id : -1;
    if (userId < 0) {
      // Invalid id
      return res.status(200).send('User is already deleted or could not be found');
    }

    await deleteUser(userId);
    return res.status(200).send();
  }
  catch(error) {
    next(error);
  }
});

export default trackPreferencesRouter;
