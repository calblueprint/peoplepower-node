require('dotenv-safe').config(); // Set up environment variables
const fetch = require('node-fetch'); // Import fetch (for network requests)
const moment = require('moment');

const EnphaseUtils = require('./utils/enphase.js');

async function main() {
  const result = await generateBill(
    process.env.SAMPLE_ENPHASE_USER_ID,
    process.env.SAMPLE_ENPHASE_SYSTEM_ID,
    moment().subtract(30, 'days'),
    moment()
  );
}

async function generateBill(userId, systemId, startDate, endDate) {
  const generationData = await EnphaseUtils.getEnphaseData(
    userId,
    systemId,
    startDate,
    endDate
  );

  const utilityData = { netGeneration: 1000, ebceRebate: 10 };
}

main();
