import dotenv from 'dotenv-safe';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
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

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '', // gmail email
      pass: '' // gmail password
    }
  });

  const info = await transporter.sendMail({
    from: '"Nick Wong ⚡️🔋" <pillbeacon@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'PP POWER invites you!!', // Subject line
    text: `Some link with ${RECORD_ID} embedded in it`, // plain text body
    html: `<p>Some link with ${RECORD_ID} embedded in it</p>` // html body
  });

  res.send({
    status: `Successfully sent an invitation to ${info.envelope.to[0]}`
  });
});

app.listen(port, () => console.log(`aPP (Power) listening on port ${port}!`));
