import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    host: process.env.DB_HOST as string || 'localhost',
    port: Number(process.env.DB_PORT as string) || 3306,
    database: process.env.DB_DATABASE as string || 'trading_bot',
    username: process.env.DB_USERNAME as string || 'root',
    password: process.env.DB_PASSWORD as string || '',
    dialect: process.env.DB_DIALECT as string || 'mysql',
  },
  test: {
    host: process.env.DB_HOST as string || 'localhost',
    port: Number(process.env.DB_PORT as string) || 3306,
    database: process.env.DB_DATABASE as string || 'trading_bot',
    username: process.env.DB_USERNAME as string || 'root',
    password: process.env.DB_PASSWORD as string || '',
    dialect: process.env.DB_DIALECT as string || 'mysql',
  },
  production: {
    host: process.env.DB_HOST as string || 'localhost',
    port: Number(process.env.DB_PORT as string) || 3306,
    database: process.env.DB_DATABASE as string || 'trading_bot',
    username: process.env.DB_USERNAME as string || 'root',
    password: process.env.DB_PASSWORD as string || '',
    dialect: process.env.DB_DIALECT as string || 'mysql',
  },
};
