import Sequelize from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

import { DATABASE_URL } from './config.js';
import { info, error } from './logger.js';

export const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true
    }
  },
});

export const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console, // TODO: Give this a better logging solutiuon
};

export const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

export const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    info('Database connected');
  }
  catch (err) {
    error('Failed to connect to database');
    error(err);
    return process.exit(1);
  }

  return null;
};
