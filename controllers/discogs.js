const axios = require('axios')
const discogsRouter = require('express').Router()
const config = require('../utils/config')
const querystring = require('node:querystring')
const crypto = require('node:crypto')

const discogs_client_id = config.DISCOGS_CLIENT_ID
const discogs_secret = config.DISCOGS_SECRET