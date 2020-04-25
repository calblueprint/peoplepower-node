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
const { billSuccess, pdfSuccess } = EmailGenerators;

// Get latest subscriber data
const getLatestSubscriberData = async subscriberId => {
  console.log(`Get latest data for Subscriber with ID: ${subscriberId}`);
  const subscriber = await getOwnerById(subscriberId);
  console.log('Getting solar project data...');
  const solarProject = await getSolarProjectById(subscriber.solarProjectId);

  if (!subscriber.subscriberBillIds) {
    throw new Error(
      `Could not find Bill for subscriber with ID ${subscriberId}`
    );
  }

  console.log(
    `Getting subscriber bill data for IDs: ${subscriber.subscriberBillIds}`
  );
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
    previousBills,
    latestBill
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

  // Create a unique timestamp to ensure unique URL for pdf
  const pdfStamp = new Date().getTime();
  await ReactPDF.render(
    <BillTemplate
      subscriber={subscriber}
      solarProject={solarProject}
      subscriberBill={latestBill}
      previousBills={previousBills}
    />,
    `./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${latestBill.id}_${pdfStamp}.pdf`
  );

  // Update latest bill on server with PDF
  await updateSubscriberBill(latestBill.id, {
    billPdf: [
      { url: `${Constants.SERVER_URL}/${latestBill.id}_${pdfStamp}.pdf` }
    ],
    status: 'Pending'
  });
  console.log(
    `Succesfully uploaded PDF at ${Constants.SERVER_URL}/${latestBill.id}_${pdfStamp}.pdf`
  );

  // Report Success
  const approveLink = `${Constants.SERVER_URL}/approve?id=${latestBill.id}`;
  const regenerateLink = `${Constants.SERVER_URL}/regenerate?subscriberId=${subscriber.id}`;
  const localPdfPath = `./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${latestBill.id}_${pdfStamp}.pdf`;
  if (freshBillGeneration) {
    sendEmail(
      billSuccess(
        subscriber,
        solarProject,
        latestBill,
        approveLink,
        regenerateLink,
        localPdfPath
      )
    );
  } else {
    sendEmail(
      pdfSuccess(
        subscriber,
        solarProject,
        latestBill,
        approveLink,
        regenerateLink,
        localPdfPath
      )
    );
  }

  // Clean up extraneous files 20 seconds after all is said and done
  // Delay allows for Airtable to copy over PDF
  setTimeout(() => {
    try {
      console.log(
        `Deleting Temporary PDF: ${latestBill.id}_${pdfStamp}.pdf and charts`
      );
      fs.unlinkSync(
        `./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${latestBill.id}_${pdfStamp}.pdf`
      );
      fs.unlinkSync(
        `./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${latestBill.id}_chart1.png`
      );
      fs.unlinkSync(
        `./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${latestBill.id}_chart2.png`
      );
    } catch (e) {
      console.log(
        `ERROR deleting files from ${Constants.TEMP_BILL_SAVE_FOLDER_NAME} folder. Failing gracefully...`
      );
    }
  }, Constants.PDF_DELETE_DELAY * 1000);
};

export default generatePdfForSubscriber;
