/*

A set of low-level functions that gives us the details we need from the Utility API.

*/

import fetch from 'node-fetch';
import moment from 'moment';
import Constants from '../Constants';

const meterURL = `?meters=${meterId}`;
const latest = '&limit=1&order=latest_first';

const options = {
  headers: {
    Authorization: `Bearer ${process.env.UTILITY_API_KEY}`
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
const getLatestBill = async meterId => {
  const url = Constants.BILLS_BASE_URL + meterURL + latest;
  const response = await fetch(url, options);
  const latestBill = await response.json();
  const billBase = latestBill.bills[0].base;

  const startDate = moment(billBase.bill_start_date);
  const endDate = moment(billBase.bill_end_date);

  const netPgeUsage = billBase.bill_total_volume;

  const lineItems = latestBill.bills[0].line_items;
  const rebateItem = lineItems.filter(
    element => element.name === Constants.EBCE_REBATE_STRING
  );
  const ebceRebate = rebateItem[0].cost;

  return { startDate, endDate, netPgeUsage, ebceRebate };
};

export default getLatestBill;
