export default {
  // Airtable
  BASE_ID: process.env.AIRTABLE_BASE_ID,
  VIEW: 'Grid view',
  ENDPOINT_URL: process.env.AIRTABLE_ENDPOINT_URL,
  PRODUCTION_WEB_URL: process.env.PRODUCTION_WEB_URL,
  DEVELOPMENT_WEB_URLS: ['http://localhost:3001', 'http://localhost:3000'],

  // Bill Generation
  SERVER_URL: process.env.SERVER_URL,
  PDF_DELETE_DELAY: 20,
  TEMP_BILL_SAVE_FOLDER_NAME: 'temp',

  // Mailing
  SENDER_NAME: process.env.SENDER_NAME,
  EMAIL_LOGO_SRC: 'https://i.imgur.com/wD9o1iM.png',

  // Pledge Invites
  INVITE_BASE_URL: `${process.env.PRODUCTION_WEB_URL}/onboarding`,
  INVITE_PARAM: 'invite',

  // PGE Constants
  PGE_CONSUMPTION_COST: 0.07217,
  EBCE_GENERATION_COST: 0.13733,
  PCIA_COST: 0.03401
};
