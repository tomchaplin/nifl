import { Sequelize } from "sequelize";
import SQLite from 'sqlite3';

const NIFL_DB_FILE = process.env.NIFL_DB_FILE || "database.sqlite";
const NIFL_DB_NAME = process.env.NIFL_DB_NAME || 'database';
const NIFL_DB_USERNAME = process.env.NIFL_DB_NAME || 'name';
const NIFL_DB_PASSWORD = process.env.NIFL_DB_NAME || 'pass';

const sequelize = new Sequelize(NIFL_DB_NAME, NIFL_DB_USERNAME, NIFL_DB_PASSWORD, {
  dialect: 'sqlite',
  storage: `./data/${NIFL_DB_FILE}`,
  dialectModule: SQLite,
  dialectOptions: {
    mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE,

  },
  pool: {
    max: 5,
    min: 1,
    acquire: 30000,
    idle: 10000
  }
})

export default sequelize;
