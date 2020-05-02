/* eslint-disable import/imports-first */
import moment from 'moment';
import dotenv from 'dotenv-safe';
import {
  getSolarProjectById,
  getOwnerById,
  createSubscriberBill,
  updateSubscriberBill,
  getSubscriberBillsByIds,
  getRateScheduleById
} from '../airtable/request';
import { getEnphaseDataForSubscriber } from './enphase';

import sendEmail from './email';
import EmailGenerators from './emailCopy';
import getLatestPGEBill from './utilityApi';
import generatePdfForSubscriber from './pdfgeneration';

dotenv.config();
const {
  genericBillError,
  pdfBillError,
  stalePGEBillError,
  missingEnphaseDataError
} = EmailGenerators;

/*
 ** Subscriber Bill Approval **
 */
export const approveSubscriberBill = async subscriberBillId => {
  await updateSubscriberBill(subscriberBillId, { status: 'Active' });
};

/*
 ** Subscriber Bill Generation **
 */

// Gets previous subscriber bill given subscriber record
const getPreviousSubscriberBill = async subscriber => {
  const billIds = subscriber.subscriberBillIds;
  if (!billIds) {
    // Edge case for first bill
    return {
      statementNumber: 0,
      balance: 0,
      startDate: '',
      endDate: ''
    };
  }
  let bills = await getSubscriberBillsByIds(billIds);
  bills = bills.sort((a, b) => a.statementNumber - b.statementNumber);
  return bills[bills.length - 1];
};

/*
  When called, this function generates a subscriber bill for the specified
  Subscriber + Solar Project Record. A PDF will also be generated.
*/
const generateBillForSubscriber = async (subscriber, solarProject) => {
  console.log(`Generating Bill for ${subscriber.name}`);

  // Get Latest PG&E Bill for Subscriber
  const latestBill = await getLatestPGEBill(subscriber.meterId);

  const {
    netPgeUsage,
    ebceRebate,
    pgeCharges,
    ebceCharges,
    wouldBeCosts,
    startDate: startMoment,
    endDate: endMoment
  } = latestBill;

  // Get start & end date for PG&E bill
  const startDate = startMoment.format('MM/DD/YYYY');
  const endDate = endMoment.format('MM/DD/YYYY');

  // Get previous subscriber bill using statement number
  const prevBill = await getPreviousSubscriberBill(subscriber);

  // Validate that bill has not been generated before
  if (
    startDate === moment(prevBill.startDate).format('MM/DD/YYYY') ||
    endDate === moment(prevBill.endDate).format('MM/DD/YYYY')
  ) {
    console.log(
      'This PG&E bill has already been processed. Reporting error...'
    );
    sendEmail(stalePGEBillError(subscriber, solarProject, startDate, endDate));
    return;
  }

  // Update previous bill's status
  if (prevBill.id) {
    // Set previous bill to previous
    await updateSubscriberBill(prevBill.id, {
      status: 'Previous'
    });
  }

  console.log(
    `Found PGE Data for ${subscriber.name}\nNet Usage: ${netPgeUsage}\nebce Rebate: ${ebceRebate}\nstart date: ${startDate}\nend date: ${endDate}\nWould Be Costs: ${wouldBeCosts}`
  );

  // Get Enphase data for date-range found in PG&E Bill
  let generationData = await getEnphaseDataForSubscriber(
    subscriber.id,
    solarProject.enphaseUserId,
    solarProject.enphaseSystemId,
    startMoment,
    endMoment
  );

  // Convert to Kilowatt Hours
  generationData = generationData.map(x => x / 1000);

  console.log(`Found Enphase Data for ${subscriber.name}`);
  console.log(generationData);

  // Validate that generation data was not empty
  if (generationData.length === 0) {
    console.log('Enphase returned empty array. Reporting error...');
    sendEmail(
      missingEnphaseDataError(subscriber, solarProject, startDate, endDate)
    );
    return;
  }

  // Calculate total system production and generate string for charts
  const chartGenerationData = generationData.join(',');
  const systemProduction = generationData.reduce((a, b) => a + b, 0);
  console.log(
    `Saving Bill with Statement Number: ${prevBill.statementNumber + 1} for ${
      subscriber.name
    }`
  );

  // Compute bill costs
  const round = (x, y = 2) => Number(parseFloat(x).toFixed(y));
  const rateSchedule = await getRateScheduleById(subscriber.rateScheduleId);
  const estimatedRebate = round(-1 * netPgeUsage * rateSchedule.rebateRate);
  const currentCharges = round(systemProduction * rateSchedule.rate);
  const amountDue = round(currentCharges + prevBill.balance - estimatedRebate);

  // Create subscriber bill
  await createSubscriberBill({
    startDate,
    endDate,
    statementDate: moment().format('MM/DD/YYYY'),
    dueDate: moment()
      .add(30, 'days')
      .format('MM/DD/YYYY'),
    subscriberId: subscriber.id,
    solarProjectId: solarProject.id,
    rateScheduleId: rateSchedule.id,
    netPgeUsage,
    ebceRebate,
    pgeCharges,
    ebceCharges,
    wouldBeCosts,
    estimatedRebate,
    currentCharges,
    amountDue,
    chartGenerationData,
    systemProduction,
    statementNumber: prevBill.statementNumber + 1,
    balanceOnPreviousBill: prevBill.balance,
    status: 'Pending'
  });

  // Generate PDF!
  try {
    // Pulls latest bill and generates PDF. Will send success email
    console.log(`Generating PDF for ${subscriber.name}`);
    await generatePdfForSubscriber(subscriber.id, true);
  } catch (e) {
    console.log(e);
    console.log('Run into error in PDF Generation process. Reporting...');
    sendEmail(pdfBillError(subscriber, solarProject, e.message));
  }
};

export const generateBillsForSolarProject = async solarProjectId => {
  const solarProject = await getSolarProjectById(solarProjectId);

  console.log(`Generating bills for ${solarProject.name}`);
  const subscribers = await Promise.all(
    solarProject.subscriberIds.map(id => getOwnerById(id))
  );

  // Generate bills for subscriber one by one using fancy reduce syntax
  await subscribers.reduce(async (previousPromise, subscriber) => {
    await previousPromise;
    try {
      await generateBillForSubscriber(subscriber, solarProject);
    } catch (e) {
      console.log(e);
      console.log(
        `Error generating bill for subscriber: ${subscriber.name}. Reporting...`
      );
      sendEmail(genericBillError(subscriber, solarProject, e.message));
    }
  }, Promise.resolve());
};
