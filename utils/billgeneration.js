/* eslint-disable import/imports-first */
import moment from 'moment';
import dotenv from 'dotenv-safe';

import {
  getSolarProjectById,
  getOwnerById,
  getRateScheduleById,
  createSubscriberBill,
  updateSubscriberBill,
  getSubscriberBillsByStatementNumber
} from '../airtable/request';
import getEnphaseData from './enphase';
import getLatestBill from './utilityApi';

dotenv.config();

const generateBillForSubscriber = async (subscriber, solarProject) => {
  // Get data necessary to generate bill
  console.log(`Generating Bill for ${subscriber.name}`);
  const {
    netPgeUsage,
    ebceRebate,
    startDate: startMoment,
    endDate: endMoment
  } = await getLatestBill(subscriber.meterId);

  const startDate = startMoment.format('MM/DD/YYYY');
  const endDate = endMoment.format('MM/DD/YYYY');

  let prevBill;
  if (subscriber.latestBillNumber !== 0) {
    const bills = await getSubscriberBillsByStatementNumber(
      subscriber.latestBillNumber
    );
    [prevBill] = bills.filter(b => b.subscriberId[0] === subscriber.id);
  } else {
    // Edge case for first bill
    prevBill = {
      statementNumber: 0,
      totalEstimatedRebate: 0,
      balance: 0,
      startDate: '',
      endDate: ''
    };
  }

  if (
    startDate === moment(prevBill.startDate).format('MM/DD/YYYY') ||
    endDate === moment(prevBill.endDate).format('MM/DD/YYYY')
  ) {
    console.log('This PG&E bill has already been processed. Skipping!');
    return;
  }

  // Set previous bill to previous
  await updateSubscriberBill(prevBill.id, { status: 'Previous' });

  console.log(
    `Found PGE Data for ${subscriber.name}
Net Usage: ${netPgeUsage}
ebce Rebate: ${ebceRebate}
start date: ${startDate}
end date: ${endDate}`
  );
  const generationData = await getEnphaseData(
    subscriber.id,
    solarProject.enphaseUserId,
    solarProject.enphaseSystemId,
    startMoment,
    endMoment
  );
  console.log(`Found Enphase Data for ${subscriber.name}`);
  console.log(generationData);

  const rateSchedule = await getRateScheduleById(subscriber.rateScheduleId);
  const systemProduction = generationData.reduce((a, b) => a + b, 0);
  console.log(
    `Saving Bill with Statement Number: ${prevBill.statementNumber + 1} for ${
      subscriber.name
    }`
  );

  await createSubscriberBill({
    startDate,
    endDate,
    statementDate: moment().format('MM/DD/YYYY'),
    subscriberId: [subscriber.id],
    solarProjectId: [solarProject.id],
    rateScheduleId: [rateSchedule.id],
    netPgeUsage,
    ebceRebate,
    systemProduction,
    statementNumber: prevBill.statementNumber + 1,
    previousTotalEstimatedRebate: prevBill.totalEstimatedRebate,
    balanceOnPreviousBill: prevBill.balance,
    status: 'Pending'
  });
};

const generateBillsForSolarProject = async solarProjectId => {
  const solarProject = await getSolarProjectById(solarProjectId);
  console.log(`Generating bills for ${solarProject.name}`);
  const subscribers = await Promise.all(
    solarProject.subscriberIds.map(id => getOwnerById(id))
  );
  subscribers.forEach(subscriber => {
    generateBillForSubscriber(subscriber, solarProject);
  });
};

export default generateBillsForSolarProject;
