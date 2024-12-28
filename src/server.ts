import './load-env';
import dotenv from 'dotenv';
import express from 'express';
import routes from "./routes"
import bodyParser from "body-parser";
import sequelize from './config/connection';
import { logger } from './config/logger.config';


interface VolumeData {
    time: string;
    volume: number;
  }

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

app.use('/api', routes());

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
})