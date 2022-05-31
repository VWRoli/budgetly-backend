import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
