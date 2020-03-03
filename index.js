import dotenv from 'dotenv-safe';
import express from 'express';

dotenv.config(); // Set up environment variables

const app = express();
const port = process.env.PORT || 3000;

app.post('/generate', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
