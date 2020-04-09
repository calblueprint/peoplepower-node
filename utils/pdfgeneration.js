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
import generateBarChartForData from './charts/barChart';
import saveChartToFile from './charts/charts';

dotenv.config();
const {
  genericBillError,
  pdfBillError,
  stalePGEBillError,
  missingEnphaseDataError,
  billSuccess
} = EmailGenerators;

const enumerateDates = (startMoment, endMoment) => {
  const endString = endMoment.format('MM/DD/YYYY');
  const dateArray = [];
  while (startMoment.format('MM/DD/YYYY') !== endString) {
    dateArray.push(startMoment.format('MM/DD/YYYY'));
    startMoment.add(1, 'days');
  }
  dateArray.push(endString);
  return dateArray;
};

// Get Previous Bill by ID (and return dummy data if none)
const getPreviousBills = (subscriber) => {
    return await 
    if (prevBillId) {
        return await getSubscriberBillById(prevBillId);
    } else {
        return {
            amountDue: 0,
            amountReceived: 0,
            balance: 0
        };
    }
}

const generatePdf = async (
  subscriber,
  solarProject,
  subscriberBill,
  prevBillId
) => {
  // Refresh information about previous bill to get the latest calculated values
  
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
    console.log(`Deleting Temporary PDF: ${subscriberBill.id}.pdf and charts`);
    fs.unlinkSync(`./temp/${subscriberBill.id}.pdf`);
    fs.unlinkSync(`./temp/${subscriber.id}_chart.png`);
  }, Constants.PDF_DELETE_DELAY * 1000);
  return `./temp/${subscriberBill.id}.pdf`;
};
