const fetch = require('node-fetch'); // Import fetch (for network requests)

// API call to get enery over lifetime of system
const getLifetimeEnergyData = async (key, userId, systemId) => {
  // Build API Url
  const baseUrl = 'https://api.enphaseenergy.com/api/v2';

  const url = `${baseUrl}/systems/${systemId}/energy_lifetime?key=${key}&user_id=${userId}&production=all`;

  const options = {
    muteHttpExceptions: true,
    headers: {
      Accept: 'application/json'
    }
  };

  const response = await fetch(url, options);
  return response.json();
};

// date array
function getDateArray(start, length) {
  var arr = new Array(),
    dt = new Date(start);

  while (arr.length < length) {
    arr.push(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;
}

const getEnphaseData = async (key, userId, systemId) => {
  // SEE ENPHASE API DOCS HERE https://developer.enphase.com/docs

  // parse response data from energy lifetime
  const lifetimeData = await getLifetimeEnergyData(key, userId, systemId);

  return lifetimeData;
  var start_date = new Date(data.start_date);
  var meter_production = data.meter_production;
  var micro_production = data.micro_production;
  var date_array = getDateArray(start_date, meter_production.length);

  return [date_array, micro_production, meter_production];
  //   // WRITE TO SHEET
  //   // set active sheet and range
  //   var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  //   var sheet = spreadsheet.getSheets()[2];
  //   var range = sheet.getRange(1, 2, 3, meter_production.length);
  //   range.setValues([date_array, micro_production, meter_production]);
  //   Logger.log(range.getValues());
};

module.exports = {
  getEnphaseData
};
