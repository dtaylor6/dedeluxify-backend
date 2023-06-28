import { info, error as _error } from './logger.js';

export const requestLogger = (request, response, next) => {
  info('Method:', request.method);
  info('Path:  ', request.path);
  info('Body:  ', request.body);
  info('---');
  next();
};

export const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' });
  next();
};

export const errorHandler = (err, req, res, next) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    _error(err.response.data);
    _error(err.response.status);
    _error(err.response.headers);
    res.status(err.response.status).send(err.response.data);
  }
  else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    _error(err.request);
    res.status(500).send(err.request);
  }
  else {
    // Something happened in setting up the request that triggered an Error
    _error('Error', err.message);
    res.status(500).send('Something went wrong with the dedeluxify-backend');
  }
};
