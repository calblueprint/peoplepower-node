import moment from 'moment';
import {
  getSolarProjectById,
  getOwnerById,
  getRateScheduleById,
  createSubscriberBill,
  getSubscriberBillsByStatementNumber
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
  // Get data necessary to generate bill
  const { netPgeUsage, ebceRebate, startDate, endDate } = await getLatestBill(
    subscriber.meterId
  );
  const generationData = await getEnphaseData(
    subscriber.id,
    solarProject.enphaseUserId,
    solarProject.enphaseSystemId,
    startDate,
    endDate
  );

  let prevBill;
  if (subscriber.lastBillNumber !== 0) {
    [prevBill] = await getSubscriberBillsByStatementNumber(
      subscriber.lastBillNumber
    );
  } else {
    // Edge case for first bill
    prevBill = {
      statementNumber: 0,
      totalEstimatedRebate: 0,
      balance: 0
    };
  }

  const rateSchedule = await getRateScheduleById(subscriber.rateScheduleId);
  const systemProduction = generationData.reduce((a, b) => a + b, 0);

  createSubscriberBill({
    startDate: startDate.format('MM/DD/YYYY'),
    endDate: endDate.format('MM/DD/YYYY'),
    statementDate: moment().format('MM/DD/YYYY'),
    subscriberId: [subscriber.id],
    solarProjectId: [solarProject.id],
    rateScheduleId: [rateSchedule.id],
    netPgeUsage,
    ebceRebate,
    systemProduction,
    statementNumber: prevBill.statementNumber + 1,
    previousTotalEstimatedRebate: prevBill.totalEstimatedRebate,
    balanceOnPrevious: prevBill.balance
  });
};

const generateBillsForSolarProject = async solarProjectId => {
  // const subscribers = getOwnersBySolarProjectId(solarProjectId);
  const solarProject = await getSolarProjectById(solarProjectId);
  const subscribers = await Promise.all(
    solarProject.subscriberIds.map(id => getOwnerById(id))
  );
  subscribers.forEach(subscriber => {
    generateBillForSubscriber(subscriber);
  });
};

async function main() {
  generateBillsForSolarProject('');
}

main();
