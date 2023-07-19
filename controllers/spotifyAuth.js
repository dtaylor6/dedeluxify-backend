import axios from 'axios';
import { Router } from 'express';
const spotifyAuthRouter = Router();

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  FRONTEND_URL,
  SPOTIFY_REDIRECT_URI
} from '../utils/config.js';
import { stringify } from 'node:querystring';
import { randomBytes } from 'node:crypto';

const stateKey = 'spotify_auth_state';

spotifyAuthRouter.get('/login', (req, res, next) => {
  const state = randomBytes(64).toString('hex');
  res.cookie(stateKey, state);

  const scope = 'streaming user-read-private user-read-email user-modify-playback-state';

  try {
    res.redirect('https://accounts.spotify.com/authorize?' +
      stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: state
      })
    );
  }
  catch(err) {
    next(err);
  }
});

spotifyAuthRouter.get('/callback', async (req, res, next) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.redirect('/#' +
      stringify({
        error: 'state_mismatch'
      }));
  }

  res.clearCookie(stateKey);

  try {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const response = await axios
      .post(
        tokenUrl,
        {
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          grant_type: 'authorization_code'
        },
        {
          headers: {
            'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

    if (response.status === 200) {
      const redirectUrl = `${FRONTEND_URL}/login?`;

      return res.redirect(redirectUrl + stringify(
        {
          access_token: response.data.access_token
        }
      ));
    }
    else {
      return res.redirect('/#' +
        stringify({
          error: 'invalid_token'
        })
      );
    }
  }
  catch(err) {
    next(err);
  }
});

export default spotifyAuthRouter;
