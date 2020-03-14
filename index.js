import dotenv from 'dotenv-safe';
import express from 'express';
import cors from 'cors';
import generateBillsForSolarProject from './utils/billgeneration';
import sendInviteEmail from './utils/email';

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
  const RECORD_ID = req.body.pledgeInviteID;
  const confirmSend = await sendInviteEmail(RECORD_ID);

  if (confirmSend === '') {
    res.send({
      status: `An error occured when sending an invitation.`
    });
  }

  res.send({
    status: `Successfully sent an invitation to ${confirmSend}`
  });
});

app.listen(port, () => console.log(`aPP (Power) listening on port ${port}!`));
