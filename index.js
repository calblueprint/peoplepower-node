require('dotenv-safe').config(); // Set up environment variables
const fetch = require('node-fetch'); // Import fetch (for network requests)
const moment = require('moment');

const EnphaseUtils = require('./utils/enphase.js');

async function main() {
  console.log('Testing Enphase Data');
  const result = await EnphaseUtils.getEnphaseData(
    process.env.SAMPLE_ENPHASE_USER_ID,
    process.env.SAMPLE_ENPHASE_SYSTEM_ID,
    moment().subtract(30, 'days'),
    moment()
  );
  console.log(result);
}

main();
