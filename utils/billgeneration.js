/* eslint-disable import/imports-first */
import moment from 'moment';
import dotenv from 'dotenv-safe';
import fs from 'fs';

import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import {
  getSolarProjectById,
  getOwnerById,
  getRateScheduleById,
  createSubscriberBill,
  updateSubscriberBill,
  getSubscriberBillsByStatementNumber,
  getSubscriberBillById
} from '../airtable/request';
import getEnphaseData from './enphase';
import getLatestBill from './utilityApi';
import BillingTemplate from './pdf/BillingTemplate';
import Constants from '../Constants';
import sendEmail from './email';
import EmailGenerators from './emailCopy';

dotenv.config();
const {
  genericBillError,
  pdfBillError,
  stalePGEBillError,
  missingEnphaseDataError,
  billSuccess
} = EmailGenerators;

export const approveSubscriberBill = async subscriberBillId => {
  await updateSubscriberBill(subscriberBillId, { status: 'Active' });
};
const generatePdf = async (
  subscriber,
  solarProject,
  subscriberBill,
  prevBillId
) => {
  // Refresh information about previous bill to get the latest calculated values
  let prevBill;
  if (prevBillId) {
    prevBill = await getSubscriberBillById(prevBillId);
  } else {
    prevBill = {
      amountDue: 0,
      amountReceived: 0,
      balance: 0
    };
  }
  console.log(`Creating PDF for Bill# ${subscriberBill.id} ...`);
  await ReactPDF.render(
    <BillingTemplate
      subscriber={subscriber}
      solarProject={solarProject}
      subscriberBill={subscriberBill}
      prevBill={prevBill}
    />,
    `./temp/${subscriberBill.id}.pdf`
  );
  await updateSubscriberBill(subscriberBill.id, {
    billPdf: [{ url: `${Constants.SERVER_URL}/${subscriberBill.id}.pdf` }]
  });
  console.log(
    `Succesfully uploaded PDF at ${Constants.SERVER_URL}/${subscriberBill.id}.pdf`
  );
  setTimeout(() => {
    console.log(`Deleting Temporary PDF: ${subscriberBill.id}.pdf`);
    fs.unlinkSync(`./temp/${subscriberBill.id}.pdf`);
  }, Constants.PDF_DELETE_DELAY * 1000);
  return `./temp/${subscriberBill.id}.pdf`;
};

const generateBillForSubscriber = async (subscriber, solarProject) => {
  // Get data necessary to generate bill
  console.log(`Generating Bill for ${subscriber.name}`);

  const latestBill = await getLatestBill(subscriber.meterId);

  const {
    netPgeUsage,
    ebceRebate,
    startDate: startMoment,
    endDate: endMoment
  } = latestBill;
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
    console.log(
      'This PG&E bill has already been processed. Reporting error...'
    );
    sendEmail(stalePGEBillError(subscriber, solarProject, startDate, endDate));
    return;
  }

  if (prevBill.id) {
    // Set previous bill to previous
    await updateSubscriberBill(prevBill.id, { status: 'Previous' });
  }

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

  if (generationData.length === 0) {
    console.log('Enphase returned empty array. Reporting error...');
    sendEmail(
      missingEnphaseDataError(subscriber, solarProject, startDate, endDate)
    );
    return;
  }

  const rateSchedule = await getRateScheduleById(subscriber.rateScheduleId);
  const systemProduction = generationData.reduce((a, b) => a + b, 0) / 1000;
  console.log(
    `Saving Bill with Statement Number: ${prevBill.statementNumber + 1} for ${
      subscriber.name
    }`
  );

  const newBillId = await createSubscriberBill({
    startDate,
    endDate,
    statementDate: moment().format('MM/DD/YYYY'),
    dueDate: moment()
      .add(1, 'M')
      .format('MM/DD/YYYY'),
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

  // Get computed Fields
  const newBill = await getSubscriberBillById(newBillId);

  // Generate PDF!
  let localPdfPath;
  try {
    localPdfPath = await generatePdf(
      subscriber,
      solarProject,
      newBill,
      prevBill.id
    );
  } catch (e) {
    console.log(e);
    console.log('Run into error in PDF Generation process. Reporting...');
    sendEmail(pdfBillError(subscriber, solarProject, e.message));
    return;
  }

  // Report Success
  const approveLink = `${Constants.SERVER_URL}/approve?id=${newBill.id}`;
  sendEmail(
    billSuccess(subscriber, solarProject, newBill, approveLink, localPdfPath)
  );
};

export const generateBillsForSolarProject = async solarProjectId => {
  const solarProject = await getSolarProjectById(solarProjectId);

  console.log(`Generating bills for ${solarProject.name}`);
  const subscribers = await Promise.all(
    solarProject.subscriberIds.map(id => getOwnerById(id))
  );

  subscribers.forEach(async subscriber => {
    try {
      await generateBillForSubscriber(subscriber, solarProject);
    } catch (e) {
      console.log(e);
      console.log(
        `Error generating bill for subscriber: ${subscriber.name}. Reporting...`
      );
      sendEmail(genericBillError(subscriber, solarProject, e.message));
    }
  });
};
