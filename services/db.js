import Sequelize from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

import { DATABASE_URL } from '../utils/config.js';
import { info, error } from '../utils/logger.js';
import { NODE_ENV } from '../utils/config.js';

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true
    }
  },
  logging: false
});

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: NODE_ENV === 'test' ? undefined : console
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    info('Database connected');
  }
  catch (err) {
    error('Failed to connect to database');
    error(err);
    console.log(err); // temp for pipeline
    return process.exit(1);
  }

  return null;
};

export {
  sequelize,
  migrationConf,
  runMigrations,
  rollbackMigration,
  connectToDatabase
};
