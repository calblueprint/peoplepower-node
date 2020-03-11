import dotenv from 'dotenv-safe';
import express from 'express';
import cors from 'cors';
import generateBillsForSolarProject from './utils/billgeneration';

dotenv.config(); // Set up environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('temp')); // Make PDFs accessible

app.post('/generate', (req, res) => {
  const { solarProjectId } = req.body;
  console.log('Received Generate Request with body:');
  console.log(req.body);
  if (solarProjectId) {
    generateBillsForSolarProject(solarProjectId);
  }
  res.end();
});

app.get('/', (req, res) => {
  res.send(
    'Nothing to see here. Try sending a request to one of the backend endpoints!'
  );
});

app.listen(port, () => console.log(`Express App Listening on port ${port}!`));
