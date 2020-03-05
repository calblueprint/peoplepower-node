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
  const MAIL_SERVER_EMAIL = ''; // this is the GMAIL you want to send emails from. "nick@gmail.com"
  const MAIL_SERVER_PASS = ''; // this is your GMAIL password
  const SENDER_NAME = ''; // specify the name of the person sending an email, for example: "Nick Wong ⚡️🔋"

  const RECORD_ID = req.body.pledgeInviteID;
  const pledgeInvite = await getPledgeInviteById(RECORD_ID);
  const { email: recipientEmail } = pledgeInvite;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: MAIL_SERVER_EMAIL,
      pass: MAIL_SERVER_PASS
    }
  });

  const baseUrl = 'https://peoplepower.netlify.com/onboarding';
  const inviteParameter = `?token=${RECORD_ID}`;
  const inviteLink = baseUrl + inviteParameter;

  const info = await transporter.sendMail({
    from: `"${SENDER_NAME}" <${MAIL_SERVER_EMAIL}>`, // sender address
    to: recipientEmail, // list of receivers
    subject: 'PP POWER invites you!!', // Subject line
    text: `Welcome to People Power Solar Cooperative! To join, you can create your account via this link: ${inviteLink}`, // plain text body
    html: `<h3>Welcome to People Power Solar Cooperative!</h3><br /><p>To join, you can create your account via this link: ${inviteLink}</p>` // html body
  });

  // on email send, nodemailer returns an info obj specifiying details of the completed email send.
  const sentEmailRecipient = info.envelope.to[0];

  res.send({
    status: `Successfully sent an invitation to ${sentEmailRecipient}`
  });
});

app.listen(port, () => console.log(`aPP (Power) listening on port ${port}!`));
