import app from './app.js';
import { createServer } from 'http';
import { PORT, NODE_ENV } from './utils/config.js';
import { info } from './utils/logger.js';

const server = createServer(app);
import { connectToDatabase } from './utils/db.js';

const start = async () => {
  await connectToDatabase();
  server.listen(PORT, () => {
    info(`Dedeluxify backend server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

start();
