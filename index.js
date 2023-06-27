const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);
const { connectToDatabase } = require('./utils/db');

const start = async () => {
  await connectToDatabase();
  server.listen(config.PORT, () => {
    logger.info(`Dedeluxify backend server running on port ${config.PORT}`);
  });
};

start();
