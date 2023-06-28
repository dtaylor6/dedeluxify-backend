import express, { json } from 'express';
import 'express-async-errors';
const app = express();
// const inProd = process.env.NODE_ENV === 'production'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import spotifyRouter from './controllers/spotify.js';
import spotifyAuthRouter from './controllers/spotifyAuth.js';
import trackPreferencesRouter from './controllers/trackPreferences.js';
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js';

app.use(cors()); // TODO: fix cors policy so it's not a wildcard
app.use(cookieParser());
app.use(json());

app.use(requestLogger);

app.use('/api/spotify', spotifyAuthRouter);
app.use('/api/spotify', spotifyRouter);
app.use('/api/trackPreferences', trackPreferencesRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
