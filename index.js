import dotenv from 'dotenv-safe';
import express from 'express';
import { getPledgeInviteById } from './airtable/request';

dotenv.config(); // Set up environment variables

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) =>
  res.send("PP Power's backend-but-not-really-a-backend... side-end!?")
);

app.get('/testInvite', async (req, res) => {
  const RECORD_ID = 'rectNi1BOY05hXto7';

  getPledgeInviteById(RECORD_ID)
    .then(value => {
      res.json(value);
    })
    .catch(bad => {
      console.error(bad);
      res.send(bad);
    });
});

app.post('/invite', (req, res) => {
  /* 

    Sprint Task 2 (part 2/3):

    1. Post to /invite with the RECORD_ID generated from AirTable on the frontend.
    2. Pull that record given the RECORD_ID and extract email
    3. Send an email using nodemailer to the extracted email CONTAINING a link to onboarding carrying the RECORD_ID
  
  */

  res.send('Hello World!');
});

app.listen(port, () => console.log(`aPP (Power) listening on port ${port}!`));
