const express = require('express');
require('express-async-errors');
const app = express();
// const inProd = process.env.NODE_ENV === 'production'
const cors = require('cors');
const cookieParser = require('cookie-parser');

const spotifyRouter = require('./controllers/spotify');
const spotifyAuthRouter = require('./controllers/spotifyAuth');
const trackPreferencesRouter = require('./controllers/trackPreferences');
const middleware = require('./utils/middleware');

app.use(cors()); // TODO: fix cors policy so it's not a wildcard
app.use(cookieParser());
app.use(express.json());

app.use(middleware.requestLogger);

app.use('/api/spotify', spotifyAuthRouter);
app.use('/api/spotify', spotifyRouter);
app.use('/api/trackPreferences', trackPreferencesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
