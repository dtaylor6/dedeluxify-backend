import axios from 'axios';
import getOriginalAlbumTracks from '../utils/discogs.js';
import { Router } from 'express';
const spotifyRouter = Router();

import { getAlbumTracks, playTracks, queueTracks } from '../utils/spotifyUtils.js';
import { combineTrackLists } from '../utils/stringUtils.js';

// Ensure a proper token is given for each request to this route
spotifyRouter.use((req, res, next) => {
  const auth = req.headers['authorization'];

  if (auth === '') {
    return res.status(401).send('No Spotify auth token given in header');
  }
  else if (!auth.startsWith('Bearer ')) {
    return res.status(401).send('Malformatted Spotify auth token given in header. Must be of format: Bearer <token>');
  }

  req.token = auth;
  next();
});

spotifyRouter.get('/search', (req, res, next) => {
  const query = req.query.q;

  // Prevent empty query request to Spotify API
  if (query === '') {
    return res.status(400).send('No search query');
  }

  axios
    .get(
      'https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'album'
        },
        headers: {
          'Authorization': req.token,
        }
      }
    )
    .then((response) => {
      res.status(200).json(response.data.albums.items);
    })
    .catch ((error) => {
      next(error);
    });
});

spotifyRouter.get('/play', async (req, res, next) => {
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
        getOriginalAlbumTracks(albumId, token)
      ]);

    const spotifyTracks = trackPromise[0];
    const discogsTracks = trackPromise[1];

    // May return an empty array
    const masterTracks = combineTrackLists(spotifyTracks, discogsTracks);

    // Call Spotify middleware to play original track list
    const queueResponse = (masterTracks.length > 0) ?
      await playTracks(masterTracks, uri, token) :
      await playTracks(spotifyTracks, uri, token);

    res.status(200).json(queueResponse);
  }
  catch(error) {
    next(error);
  }
});

spotifyRouter.get('/queue', async (req, res, next) => {
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
        getOriginalAlbumTracks(albumId, token)
      ]);

    const spotifyTracks = trackPromise[0];
    const discogsTracks = trackPromise[1];
    // May return an empty array
    const masterTracks = combineTrackLists(spotifyTracks, discogsTracks);

    // Call Spotify middleware to queue original track list
    const queueResponse = (masterTracks.length > 0) ?
      await queueTracks(masterTracks, uri, token) :
      await queueTracks(spotifyTracks, uri, token);

    res.status(200).json(queueResponse);
  }
  catch(error) {
    next(error);
  }
});

export default spotifyRouter;
