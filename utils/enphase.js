const fetch = require('node-fetch'); // Import fetch (for network requests)
const moment = require('moment');

const baseUrl = 'https://api.enphaseenergy.com/api/v2';
const key = process.env.ENPHASE_KEY;

// SEE ENPHASE API DOCS HERE https://developer.enphase.com/docs
// Returns object with `production`, `meter_production`, `micro_production` keys with production data
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
  return await response.json();
};

module.exports = {
  getEnphaseData
};
