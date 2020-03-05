import dotenv from 'dotenv-safe';
import express from 'express';
import cors from 'cors';
import { getPledgeInviteById } from './airtable/request';
import generateBillsForSolarProject from './utils/billgeneration';

dotenv.config(); // Set up environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.post('/invite', async (req, res) => {
  /* 

    Sprint Task 2 (part 2/3):

    ✅ 1. Post to /invite with the RECORD_ID generated from AirTable on the frontend.
    ✅ 2. Pull that record given the RECORD_ID and extract email
    3. Send an email using nodemailer to the extracted email CONTAINING a link to onboarding carrying the RECORD_ID
  
  */

  const RECORD_ID = req.body.pledgeInviteID;

  console.log('INCOMING POST:', RECORD_ID);

  const pledgeInvite = await getPledgeInviteById(RECORD_ID);

  const { email } = pledgeInvite;

  // send email

  res.send({
    id: RECORD_ID,
    email
  });
});

app.listen(port, () => console.log(`aPP (Power) listening on port ${port}!`));
