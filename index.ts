import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import usersRoutes from './routes/users.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.use('/users', usersRoutes);

app.get('/', (req: Request, res: Response) => res.send('Hello from home page'));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
