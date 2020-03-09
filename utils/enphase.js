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
const getEnphaseData = async (
  subscriberId,
  userId,
  systemId,
  startDate,
  endDate
) => {
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
  const data = await response.json();
  return getDataForSubscriber(subscriberId, data);
};

export default getEnphaseData;
