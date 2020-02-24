/*

A set of low-level functions that gives us the details we need from the Utility API.

*/

const fetch = require("node-fetch");

const getBills = async (meterUID) => {

	const API_KEY = process.env.UTILITY_API_KEY;

	// Base URL for Utility API BILLS
	var api_url = 'https://utilityapi.com/api/v2/bills';

	// use this with any request
	var meter_uid = '?meters=' + meterUID;

	var options = {
	  muteHttpExceptions: true,
	  headers: {
	    'Authorization': `Bearer ${API_KEY}`
	  }
	};

	var url = api_url + meter_uid

	console.log(options)

	const response = await fetch(url, options);

	return response
}

module.exports = {
  getBills
};
