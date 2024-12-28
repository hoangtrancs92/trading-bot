import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

// Connect to the database
const sequelize = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + '/../models/**/*.ts'],
    logging: false,
    dialect: 'mysql',
});

export default sequelize;