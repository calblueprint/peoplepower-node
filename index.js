import {
  createGeneration,
  createPGEUsage,
  getSolarProjectById,
  getOwnerById
} from './airtable/request';
import getEnphaseData from './utils/enphase';
import getLatestBill from './utils/utilityApi';

require('dotenv-safe').config(); // Set up environment variables

// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;

// app.post('/generate', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const generateBillForSubscriber = async (subscriber, solarProject) => {
  const { netUsage, ebceRebate, startDate, endDate } = getLatestBill(
    subscriber.meterId
  );
  const generationData = await getEnphaseData(
    subscriber.id,
    solarProject.enphaseUserId,
    solarProject.enphaseSystemId,
    startDate,
    endDate
  );

  const systemGeneration = generationData.reduce((a, b) => a + b, 0);

  createGeneration({
    amount: systemGeneration,
    solarProjectId: [solarProject.id],
    subscriberOwnerId: [subscriber.id],
    startDate: startDate.format('MM/DD/YYYY'),
    endDate: endDate.format('MM/DD/YYYY')
  });
  createPGEUsage({
    solarProjectId: [solarProject.id],
    subscriberOwnerId: [subscriber.id],
    startDate: startDate.format('MM/DD/YYYY'),
    endDate: endDate.format('MM/DD/YYYY'),
    netUsage,
    ebceRebate
  });
};

const generateBillsForSolarProject = async solarProjectId => {
  // const subscribers = getOwnersBySolarProjectId(solarProjectId);
  const solarProject = await getSolarProjectById(solarProjectId);
  const subscribers = await Promise.all(
    solarProject.subscriberOwnerIds.map(id => getOwnerById(id))
  );
  subscribers.forEach(subscriber => {
    generateBillForSubscriber(subscriber);
  });
};

async function main() {
  generateBillsForSolarProject('');
}

main();
