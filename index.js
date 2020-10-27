import dotenv from 'dotenv-safe';
import express from 'express';
import cors from 'cors';
import Airlock from 'airlock-server';
import { sendInviteEmail } from './utils/pledgeInvite';
import generatePdfForSubscriber from './utils/pdfgeneration';
import EmailGenerators from './utils/emailCopy';
import sendEmail from './utils/email';
import {
  getSolarProjectById,
  updateSolarProject,
  getOwnersByEmail
} from './airtable/request';
import Constants from './Constants';

const { pdfRegenerationError } = EmailGenerators;

// This call sets up environment variables and ensures that all variables in .env.example exist
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
/* eslint-disable no-new */
/* 
  Airlock is @calblueprint's platform solution to authentication
  and access control. It's an intermediate server between client apps 
  and Airtable: https://www.npmjs.com/package/airlock-server
 */
new Airlock({
  server: app,
  allowedOrigins: [
    Constants.PRODUCTION_WEB_URL,
    ...Constants.DEVELOPMENT_WEB_URLS
  ],
  airtableApiKey: [apiKey],
  airtableBaseId: Constants.BASE_ID,
  airtableUserTableName: 'Owner',
  airtableUsernameColumn: 'Email',
  airtablePasswordColumn: 'Password'
});

app.get('/', (_, res) => {
  res.send(
    'Nothing to see here. Try sending a request to one of the backend endpoints!'
  );
});

app.post('/invite', async (req, res) => {
  console.log('Received Invite Request with body:');
  console.log(req.body);
  const confirmSend = await sendInviteEmail(req.body.pledgeInviteId);

  if (confirmSend === '') {
    res.send({
      status: `An error occured when sending an invitation.`
    });
  }

  res.send({
    status: `Successfully sent an invitation to ${confirmSend}`
  });
});

app.get('/uniqueEmail', async (req, res) => {
  console.log('Received Email Uniqueness Request with query');
  console.log(req.query);
  const { email } = req.query;
  const owners = await getOwnersByEmail(email);
  console.log(`Found ${owners.length} owners with email: ${email}`);
  res.json({ unique: owners.length === 0 });
});

app.listen(port, () => console.log(`PP (Power) listening on port ${port}!`));
