import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import connectDB from './config/db.js';

import usersRoutes from './routes/users.js';
import transactionsRoutes from './routes/transactions.js';

dotenv.config();

connectDB();

const app: Express = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/transactions', transactionsRoutes);

app.get('/', (req: Request, res: Response) =>
  res.send('This is the home page for the budgetly app backend'),
);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
