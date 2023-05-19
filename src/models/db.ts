import { Sequelize } from "sequelize";
import SQLite from 'sqlite3';

const sequelize = new Sequelize('database', 'name', 'pass', {
  dialect: 'sqlite',
  storage: 'database.sqlite',
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
