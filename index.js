import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
