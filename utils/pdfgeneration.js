/* eslint-disable import/imports-first */
import moment from 'moment';
import dotenv from 'dotenv-safe';
import fs from 'fs';

import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import {
  getSolarProjectById,
  getSubscriberById,
  updateSubscriberBill,
  getSubscriberBillsByIds
} from '../airtable/request';
import getEnphaseData from './enphase';
import getLatestBill from './utilityApi';
import BillingTemplate from './pdf/BillingTemplate';
import Constants from '../Constants';
import sendEmail from './email';
import EmailGenerators from './emailCopy';
import saveChartToFile from './charts/charts';
import { generateGenerationDataChart } from './chartGeneration';

dotenv.config();
const {
  genericBillError,
  pdfBillError,
  stalePGEBillError,
  missingEnphaseDataError,
  billSuccess
} = EmailGenerators;

// Get latest subscriber data
const getLatestSubscriberData = async subscriberId => {
  const subscriber = await getSubscriberById(subscriberId);
  const solarProject = await getSolarProjectById(subscriber.solarProjectId);

  if (!subscriber.subscriberBillIds) {
    throw new Error(
      `Could not find Bill for subscriber with ID ${subscriberId}`
    );
  }

  const bills = await getSubscriberBillsByIds(subscriber.subscriberBillIds);
  const latestBill = bills[bills.length - 1];
  const previousBills = bills.slice(0, bills.length - 1);
  return { subscriber, solarProject, latestBill, previousBills };
};

// Generate charts for both subscriber bills based on bill data

const generateChartsForSubscriberBill = async (
  subscriber,
  latestBill,
  previousBills
) => {
  console.log(`Generating Generation Data Bar Chart for ${subscriber.name}`);
  const generationChart = generateGenerationDataChart(latestBill);
  await saveChartToFile(generationChart, `${latestBill.id}_chart1`);

  console.log(`Finished generating charts for ${subscriber.name}`);
};

// Generate PDF for subscriber's latest bill
const generatePdfForSubscriber = async (
  subscriberId,
  freshBillGeneration = false
) => {
  // Refresh information about subscriber
  const {
    subscriber,
    solarProject,
    latestBill,
    previousBills
  } = await getLatestSubscriberData(subscriberId);

  // Generate Charts (images saved locally)
  await generateChartsForSubscriberBill(subscriber, latestBill, previousBills);

  // Generate PDF for latest bill
  console.log(`Creating PDF for Bill# ${latestBill.id} ...`);
  await ReactPDF.render(
    <BillingTemplate
      subscriber={subscriber}
      solarProject={solarProject}
      subscriberBill={latestBill}
      previousBills={previousBills}
    />,
    `./temp/${latestBill.id}.pdf`
  );

  // Update latest bill on server with PDF
  await updateSubscriberBill(latestBill.id, {
    billPdf: [{ url: `${Constants.SERVER_URL}/${latestBill.id}.pdf` }],
    status: 'Pending'
  });
  console.log(
    `Succesfully uploaded PDF at ${Constants.SERVER_URL}/${latestBill.id}.pdf`
  );

  // Report Success
  if (freshBillGeneration) {
    // Differ emails
  }

  const approveLink = `${Constants.SERVER_URL}/approve?id=${newBillId}`;
  sendEmail(
    billSuccess(subscriber, solarProject, newBill, approveLink, localPdfPath)
  );

  // Clean up extraneous files
  setTimeout(() => {
    console.log(`Deleting Temporary PDF: ${latestBill.id}.pdf and charts`);
    fs.unlinkSync(`./temp/${latestBill.id}.pdf`);
    fs.unlinkSync(`./temp/${latestBill.id}_chart1.png`);
    fs.unlinkSync(`./temp/${latestBill.id}_chart2.png`);
  }, Constants.PDF_DELETE_DELAY * 1000);
  return `./temp/${latestBillBill.id}.pdf`;
};

export default generatePdfForSubscriber;
