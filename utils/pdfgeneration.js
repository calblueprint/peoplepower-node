/* eslint-disable import/imports-first */
import dotenv from 'dotenv-safe';
import fs from 'fs';

import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import {
  getSolarProjectById,
  updateSubscriberBill,
  getSubscriberBillsByIds,
  getOwnerById
} from '../airtable/request';
import Constants from '../Constants';
import sendEmail from './email';
import EmailGenerators from './emailCopy';
import saveChartToFile from './charts/charts';
import {
  generateGenerationDataChart,
  generateCostOverTimeChart
} from './chartGeneration';
import BillTemplate from './pdf/BillTemplate';

dotenv.config();
const { billSuccess } = EmailGenerators;

// Get latest subscriber data
const getLatestSubscriberData = async subscriberId => {
  const subscriber = await getOwnerById(subscriberId);
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

  console.log(`Generating Cost Over Time chart for ${subscriber.name}`);
  const costOverTimeChart = generateCostOverTimeChart(
    latestBill,
    previousBills
  );
  await saveChartToFile(costOverTimeChart, `${latestBill.id}_chart2`);

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
    <BillTemplate
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
  const approveLink = `${Constants.SERVER_URL}/approve?id=${latestBill.id}`;
  const localPdfPath = `./temp/${latestBill.id}.pdf`;
  if (freshBillGeneration) {
    sendEmail(
      billSuccess(
        subscriber,
        solarProject,
        latestBill,
        approveLink,
        localPdfPath
      )
    );
  } else {
    // TODO: Custom email for fresh PDF generation
    sendEmail(
      billSuccess(
        subscriber,
        solarProject,
        latestBill,
        approveLink,
        localPdfPath
      )
    );
  }

  // Clean up extraneous files 20 seconds after all is said and done
  // Delay allows for Airtable to copy over PDF
  setTimeout(() => {
    console.log(`Deleting Temporary PDF: ${latestBill.id}.pdf and charts`);
    fs.unlinkSync(`./temp/${latestBill.id}.pdf`);
    fs.unlinkSync(`./temp/${latestBill.id}_chart1.png`);
    fs.unlinkSync(`./temp/${latestBill.id}_chart2.png`);
  }, Constants.PDF_DELETE_DELAY * 1000);
};

export default generatePdfForSubscriber;
