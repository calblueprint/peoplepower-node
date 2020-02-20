require('dotenv-safe').config(); // Set up environment variables
const fetch = require('node-fetch'); // Import fetch (for network requests)

// This function (for now) will be what is called when the program is run.
// Use this to help test other functions
function main() {
  console.log('Testing Enphase Data');
  getEnphaseData(
    process.env.ENPHASE_KEY,
    process.env.SAMPLE_ENPHASE_USER_ID,
    process.env.SAMPLE_ENPHASE_SYSTEM_ID
  );
}

// Add other functions below that perform the individual operations
// Example: (Pull data from EnPhase API, Generate PDF given billing data, etc.)

function getEnphaseData(key, userId, systemId) {
  // SEE ENPHASE API DOCS HERE https://developer.enphase.com/docs

  // Base URL for Enphase Enlighten API v2
  var api_url = 'https://api.enphaseenergy.com/api/v2';

  // use this with any request
  var user_params = 'key=' + key + '&user_id=' + userId;

  var options = {
    muteHttpExceptions: true,
    headers: {
      Accept: 'application/json'
    }
  };

  // API call to get enery over lifetime of system
  function energyLifetime(system_id) {
    var url =
      api_url +
      '/systems/' +
      system_id +
      '/energy_lifetime?' +
      user_params +
      '&production=all';
    var response = UrlFetchApp.fetch(url, options);

    return response;
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

  // parse response data from energy lifetime
  var json = energyLifetime(system_id_ljf).getContentText();
  var data = JSON.parse(json);

  var start_date = new Date(data.start_date);
  var meter_production = data.meter_production;
  var micro_production = data.micro_production;
  var date_array = getDateArray(start_date, meter_production.length);

  // WRITE TO SHEET
  // set active sheet and range
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[2];
  var range = sheet.getRange(1, 2, 3, meter_production.length);
  range.setValues([date_array, micro_production, meter_production]);
  Logger.log(range.getValues());
}

main();
