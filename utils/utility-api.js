/*

A set of low-level functions that gives us the details we need from the Utility API.

*/

const fetch = require("node-fetch");
const API_KEY = process.env.UTILITY_API_KEY;

// Base URL for Utility API BILLS
const bills_base_url = 'https://utilityapi.com/api/v2/bills';

const options = {
	headers: {
		'Authorization': `Bearer ${API_KEY}`
	}
};


/* Given a meterUID, return an object containing Net Usage and EBCE Rebate

	{
		netUsage:
		ebce_rebate:
	}
*/
const getLatestBill = async (meterUID) => {

	var meter_uid = '?meters=' + meterUID;
	var latest = '&limit=1&order=latest_first';

	var url = bills_base_url + meter_uid + latest;
	const response = await fetch(url, options);
	const responseToJson = await response.json();
	const pge_details = responseToJson.bills[0]["pge_details"];
	const netUsage = pge_details.consumption + pge_details.net_generation;

	const line_items = responseToJson.bills[0]["line_items"];
	const rebate_item = line_items.filter(function(element) {
		return element.name === 'Credited to (Debited from) NEM Balance'
	})

	const rebate = rebate_item[0].cost

	var returnObj = {
		netUsage: netUsage,
		ebce_rebate: rebate
	}

	return returnObj
}


module.exports = {
  getLatestBill
};
