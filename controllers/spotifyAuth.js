import pkg from 'request';
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

spotifyAuthRouter.get('/login', (req, res) => {
  const state = randomBytes(64).toString('hex');
  res.cookie(stateKey, state);

  const scope = 'streaming user-read-private user-read-email user-modify-playback-state';

  res.redirect('https://accounts.spotify.com/authorize?' +
    stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state
    })
  );
});

spotifyAuthRouter.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.redirect('/#' +
      stringify({
        error: 'state_mismatch'
      }));
  }
  else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64'))
      },
      json: true
    };
  }

  pkg.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const redirectUrl = `${FRONTEND_URL}/login?`;

      return res.redirect(redirectUrl + stringify(
        { access_token: access_token
          //refresh_token: refresh_token
        }));
    }
    else {
      return res.redirect('/#' +
        stringify({
          error: 'invalid_token'
        })
      );
    }
  });
});

export default spotifyAuthRouter;
