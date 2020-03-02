/*

A set of low-level functions that gives us the details we need from the Utility API.

*/

const fetch = require("node-fetch");
const moment = require('moment');
const API_KEY = process.env.UTILITY_API_KEY;
const EBCERebateString = 'Credited to (Debited from) NEM Balance';

// Base URL for Utility API BILLS
const billsBaseUrl = 'https://utilityapi.com/api/v2/bills';

const options = {
	headers: {
		'Authorization': `Bearer ${API_KEY}`
	}
};


/* Given a meterUID, return an object containing Net Usage and EBCE Rebate
	{
		startDate:
		endDate:
		netUsage:
		EBCERebate:
	}
*/
const getLatestBill = async (meterUID) => {

	var meterURL = '?meters=' + meterUID;
	var latest = '&limit=1&order=latest_first';

	var url = billsBaseUrl + meterURL + latest;
	const response = await fetch(url, options);
	const latestBill = await response.json();
	const pgeDetails = latestBill.bills[0]["pgeDetails"];
	const billBase = latestBill.bills[0]["base"];
	
	const startDate = moment(billBase["bill_start_date"]);
	const endDate = moment(billBase["bill_end_date"]);
	
	const netUsage = billBase["bill_total_volume"];

	const lineItems = latestBill.bills[0]["line_items"];
	const rebateItem = lineItems.filter(element => element.name === EBCERebateString);
	const EBCERebate = rebateItem[0].cost;

	return { startDate, endDate, netUsage, EBCERebate }
}


module.exports = {
  getLatestBill
};
