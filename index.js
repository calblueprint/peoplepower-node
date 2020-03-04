import dotenv from 'dotenv-safe';
import express from 'express';
import generateBillsForSolarProject from './utils/billgeneration';

dotenv.config(); // Set up environment variables

const app = express();
const port = process.env.PORT || 3000;

app.post('/generate', (req, res) => {
  const { solarProjectId } = req.body;
  generateBillsForSolarProject(solarProjectId);
  res.end();
});

app.get('/', (req, res) => {
  res.send(
    'Nothing to see here. Try sending a request to one of the backend endpoints!'
  );
});

app.listen(port, () => console.log(`Express App Listening on port ${port}!`));
