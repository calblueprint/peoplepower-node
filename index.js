import dotenv from 'dotenv-safe';
import express from 'express';
import cors from 'cors';
import {
  generateBillsForSolarProject,
  approveSubscriberBill
} from './utils/billgeneration';
import { sendInviteEmail } from './utils/pledgeInvite';
import generatePdfForSubscriber from './utils/pdfgeneration';
import EmailGenerators from './utils/emailCopy';
import sendEmail from './utils/email';

const { pdfRegenerationError } = EmailGenerators;

dotenv.config(); // Set up environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('temp')); // Make PDFs accessible

app.get('/', (_, res) => {
  res.send(
    'Nothing to see here. Try sending a request to one of the backend endpoints!'
  );
});

app.post('/generate', (req, res) => {
  const { solarProjectId } = req.body;
  console.log('Received Generate Request with body:');
  console.log(req.body);
  if (solarProjectId) {
    generateBillsForSolarProject(solarProjectId);
  }
  res.end();
});

app.get('/regenerate', (req, res) => {
  const { subscriberId } = req.query;
  console.log('Received regenerate request with query:');
  console.log(req.query);
  if (subscriberId) {
    generatePdfForSubscriber(subscriberId).catch(e => {
      console.log(e);
      console.log('Run into error in PDF Generation process. Reporting...');
      sendEmail(pdfRegenerationError(e.message));
    });
  }
  res.send(
    'Regenerating bill from latest data on Airtable... Wait for an email and check airtable'
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

app.get('/approve', async (req, res) => {
  console.log('Received Approve Request with query:');
  console.log(req.query);
  const billId = req.query.id;
  try {
    await approveSubscriberBill(billId);
    res.send('Subscriber Bill Approved!');
  } catch (e) {
    console.log(e);
    console.log('Request Approval Failed.');
    res
      .status(400)
      .send(
        'Request Approval Failed, likely due to malformed request or nonexistent subscriber ID.'
      );
  }
});

app.listen(port, () => console.log(`PP (Power) listening on port ${port}!`));
