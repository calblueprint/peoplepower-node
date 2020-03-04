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
  const { netPgeUsage, ebceRebate, startDate, endDate } = await getLatestBill(
    subscriber.meterId
  );

  console.log(
    `Found PGE Data for ${subscriber.name}
Net Usage: ${netPgeUsage}
ebce Rebate: ${ebceRebate}
start date: ${startDate.format('MM/DD/YYYY')}
end date: ${endDate.format('MM/DD/YYYY')}`
  );
  const generationData = await getEnphaseData(
    subscriber.id,
    solarProject.enphaseUserId,
    solarProject.enphaseSystemId,
    startDate,
    endDate
  );
  console.log(`Found Enphase Data for ${subscriber.name}`);
  console.log(generationData);

  let prevBill;
  if (subscriber.latestBillNumber !== 0) {
    const bills = await getSubscriberBillsByStatementNumber(
      subscriber.latestBillNumber
    );
    [prevBill] = bills.filter(b => b.subscriberId[0] === subscriber.id);

    await updateSubscriberBill(prevBill.id, { status: 'Previous' });
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
  console.log(
    `Generating Bill with Statement Number: ${prevBill.statementNumber + 1}`
  );

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
