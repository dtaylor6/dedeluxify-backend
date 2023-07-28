import express, { json, Router } from 'express';
import 'express-async-errors';
const app = express();
const router = Router();
import cors from 'cors';
import cookieParser from 'cookie-parser';

import spotifyRouter from './controllers/spotify.js';
import spotifyAuthRouter from './controllers/spotifyAuth.js';
import trackPreferencesRouter from './controllers/trackPreferences.js';
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js';

router.use(cors()); // TODO: fix cors policy so it's not a wildcard
router.use(cookieParser());
router.use(json());

router.use(requestLogger);

router.use('/spotify', spotifyAuthRouter);
router.use('/spotify', spotifyRouter);
router.use('/trackPreferences', trackPreferencesRouter);

router.use(unknownEndpoint);
router.use(errorHandler);

app.use('/api/', router);

export default app;
