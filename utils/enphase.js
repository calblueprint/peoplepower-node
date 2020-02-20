const fetch = require('node-fetch'); // Import fetch (for network requests)

// API call to get enery over lifetime of system
function energyLifetime(systemId, userParams) {
  // Base URL for Enphase Enlighten API v2
  const apiUrl = 'https://api.enphaseenergy.com/api/v2';
  const options = {
    muteHttpExceptions: true,
    headers: {
      Accept: 'application/json'
    }
  };

  const url =
    apiUrl +
    '/systems/' +
    systemId +
    '/energy_lifetime?' +
    userParams +
    '&production=all';

  return fetch(url, options);
}

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

async function getEnphaseData(key, userId, systemId) {
  // SEE ENPHASE API DOCS HERE https://developer.enphase.com/docs

  // use this with any request
  var userParams = 'key=' + key + '&user_id=' + userId;

  // parse response data from energy lifetime
  var response = await energyLifetime(systemId, userParams);
  var data = response.json();

  return data;
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
}

module.exports = {
  getEnphaseData
};
