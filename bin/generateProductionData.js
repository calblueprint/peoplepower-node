import moment from 'moment';
import fetch from 'node-fetch';
import dotenv from 'dotenv-safe';
import { getAllSolarProjects } from '../airtable/request';

dotenv.config();

// This script is to be run once a day by Heroku scheduler
// It tries and download monthly production data for all solar projects and constructively updates the values in airtable
const generate = async () => {
  const currentDate = moment();
  const currentMonth = currentDate.format('MM');
  const currentYear = currentDate.format('YYYY');

  const allSolarProjects = await getAllSolarProjects();
  allSolarProjects.forEach(async project => {
    const url = `${process.env.SERVER_URL}/refreshSolarProjectData?solarProjectId=${project.id}&month=${currentMonth}&year=${currentYear}`;
    console.log(
      `Fetching Solar Project for ${project.name} using URL:\n${url}`
    );

    const response = await fetch(url);
    const data = await response.text();
    console.log(`Got Data for ${project.name}: `);
    console.log(data);
  });
};

generate();
