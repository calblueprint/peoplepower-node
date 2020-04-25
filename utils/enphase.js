const fetch = require('node-fetch'); // Import fetch (for network requests)
const moment = require('moment');

const baseUrl = 'https://api.enphaseenergy.com/api/v2';
const key = process.env.ENPHASE_KEY;

const EnphaseSettings = {
  rechN8WXaM60Xx859: data => data.meter_production, // lora foo Unit B
  recMzaIHIl5Uq1xRJ: data =>
    data.micro_production.map((v, i) => v - data.meter_production[i]) // lora foo unit A
};

// Takes the raw Enphase Response and gets the subscriber specific data out of it.
// Returns array of production values
const getDataForSubscriber = (subscriberId, data) => {
  const process = EnphaseSettings[subscriberId];
  if (process) {
    return process(data);
  }
  return [];
};

// SEE ENPHASE API DOCS HERE https://developer.enphase.com/docs
const getEnphaseData = async (userId, systemId, startDate, endDate) => {
  // Build API Url

  const queryData = {
    key,
    user_id: userId,
    production: 'all',
    start_date: moment(startDate).format('YYYY-MM-DD'),
    end_date: moment(endDate).format('YYYY-MM-DD')
  };

  const queryString = new URLSearchParams(queryData).toString();
  const url = `${baseUrl}/systems/${systemId}/energy_lifetime?${queryString}`;
  const response = await fetch(url);
  return response.json();
};

const getEnphaseDataForSubscriber = async (
  userId,
  systemId,
  startDate,
  endDate,
  subscriberId
) => {
  const data = await getEnphaseData(userId, systemId, startDate, endDate);
  return getDataForSubscriber(subscriberId, data);
};

const getStartAndEndOfMonth = (year, month) => {
  const monthMoment = moment(`${month}/${year}`, 'MM/YYYY');
  const startDate = monthMoment.startOf('month').format('YYYY-MM-DD');
  const endDate = monthMoment.endOf('month').format('YYYY-MM-DD');
  return { startDate, endDate };
};

const getEnphaseDataForMonth = async (userId, systemId, year, month) => {
  console.log(`Getting Monthly Enphase Data for: ${month}/${year}`);
  const { startDate, endDate } = getStartAndEndOfMonth(year, month);
  const data = await getEnphaseData(userId, systemId, startDate, endDate);
  return data.micro_production.reduce((a, b) => a + b, 0) / 1000; // sum up micro production values
};

export { getEnphaseDataForSubscriber, getEnphaseDataForMonth };
