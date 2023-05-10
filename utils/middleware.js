const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
  next()
}

const errorHandler = (err, req, res, next) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    logger.error(err.response.data)
    logger.error(err.response.status)
    logger.error(err.response.headers)
    return res.status(err.response.status).send(err.response.data)
  }
  else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    logger.error(err.request)
    return res.status(500).send(err.request)
  }
  else {
    // Something happened in setting up the request that triggered an Error
    logger.error('Error', err.message)
    return res.status(500).send('Something went wrong with the dedeluxify-backend')
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}