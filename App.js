const express = require('express')
require('express-async-errors')
const app = express()
//const inProd = process.env.NODE_ENV === 'production'
const cors = require('cors')
const cookieParser = require('cookie-parser')

const spotifyRouter = require('./controllers/spotify')
const discogsRouter = require('./controllers/discogs')
const middleware = require('./utils/middleware')

app.use(cors()) // TODO: fix cors policy so it's not a wildcard
app.use(cookieParser())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/spotify', spotifyRouter)
app.use('/api/discogs', discogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
