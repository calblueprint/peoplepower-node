require('dotenv-safe').config(); // Set up environment variables
const fetch = require('node-fetch'); // Import fetch (for network requests)

const EnphaseUtils = require('./utils/enphase.js');

async function main() {
  console.log('Testing Enphase Data');
  const result = await EnphaseUtils.getEnphaseData(
    process.env.ENPHASE_KEY,
    process.env.SAMPLE_ENPHASE_USER_ID,
    process.env.SAMPLE_ENPHASE_SYSTEM_ID
  );
  console.log(result);
}

main();
