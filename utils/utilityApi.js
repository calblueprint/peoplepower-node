/*

A set of low-level functions that gives us the details we need from the Utility API.

*/

import fetch from 'node-fetch';
import moment from 'moment';
import Constants from '../Constants';

// Constants
const billsBaseUrl = 'https://utilityapi.com/api/v2/bills';
const EBCERebateString = 'Credited to (Debited from) NEM Balance';
const EBCESupplierName = 'East Bay Community Energy';
const MinimumDeliveryString = 'Minimum Delivery Charge';
const { PGE_CONSUMPTION_COST, EBCE_GENERATION_COST, PCIA_COST } = Constants;

const options = {
  headers: {
    Authorization: `Bearer ${process.env.UTILITY_API_KEY}`
  }
};

const getStartDate = latestBill => moment(latestBill.base.bill_start_date);
const getEndDate = latestBill => moment(latestBill.base.bill_end_date);
const getNetPGEUsage = latestBill => latestBill.base.bill_total_volume;

// "Credited to (Debited from) NEM Balance" line item under supplier_line_items
const getEBCERebate = latestBill => {
  const supplier = latestBill.suppliers.filter(
    s => s.supplier_name === EBCESupplierName
  )[0];
  const rebateItem = supplier.supplier_line_items.filter(
    element => element.name === EBCERebateString
  );
  return rebateItem[0].cost;
};

// sum of all charges under supplier_line_items section
const getEBCECharges = latestBill => {
  const supplier = latestBill.suppliers.filter(
    s => s.supplier_name === EBCESupplierName
  )[0];

  return supplier.supplier_line_items.reduce((total, item) => {
    return total + item.cost;
  }, 0);
};

// sum of all charges under line_items section that don't appear in supplier_line_items
const getPGECharges = latestBill => {
  const supplier = latestBill.suppliers.filter(
    s => s.supplier_name === EBCESupplierName
  )[0];
  const supplierLineItems = supplier.line_items.map(item => item.name);

  return latestBill.line_items.reduce((total, item) => {
    // Only add up items that don't appear in supplier line items
    if (!supplierLineItems.includes(item.name)) {
      return total + item.cost;
    }
    return total;
  }, 0);
};

/*
Your "Would-Be" Charges w/o Solar = PGE Delivery charges + EBCE Generation Charges + PCIA 
PGE Delivery Charges -> MAX((consumption under the pge_details section) * 0.07217, (sum of all "Minimum Delivery Charge" cost line items under line_items))
EBCE Generation -> (consumption under the pge_details section) * $0.13733
PCIA -> (consumption under the pge_details section) * $0.03401
*/
const getWouldBeCosts = latestBill => {
  const pgeConsumption = latestBill.pge_details.consumption;

  // PGE Delivery Charges
  const pgeDeliveryChargesConsumption = pgeConsumption * PGE_CONSUMPTION_COST;
  const pgeDeliveryChargesMin = latestBill.line_items.reduce((total, item) => {
    if (item.name.includes(MinimumDeliveryString)) {
      return total + item.cost;
    }
    return total;
  }, 0);
  const pgeDeliveryCharges = Math.max(
    pgeDeliveryChargesConsumption,
    pgeDeliveryChargesMin
  );

  // Other
  const ebceGeneration = pgeConsumption * EBCE_GENERATION_COST;
  const pcia = pgeConsumption * PCIA_COST;
  return pcia + ebceGeneration + pgeDeliveryCharges;
};

/* Given a meterUID, return an object containing Net Usage and EBCE Rebate
	{
		startDate:
		endDate:
		netUsage:
    EBCERebate:
    pgeCharges
    ebceCharges
    wouldBeCosts
	}
*/
const getLatestPGEBill = async meterId => {
  const meterURL = `?meters=${meterId}`;
  const latest = '&limit=1&order=latest_first';

  const url = billsBaseUrl + meterURL + latest;
  const response = await fetch(url, options);
  const billData = await response.json();
  const latestBill = billData.bills[0];

  const roundDecimals = x => parseFloat(x.toFixed(2));

  // Get data using helper functions
  const startDate = getStartDate(latestBill);
  const endDate = getEndDate(latestBill);
  const netPgeUsage = getNetPGEUsage(latestBill);
  const ebceRebate = getEBCERebate(latestBill);
  const ebceCharges = getEBCECharges(latestBill);
  const pgeCharges = getPGECharges(latestBill);
  const wouldBeCosts = getWouldBeCosts(latestBill);

  return {
    startDate,
    endDate,
    netPgeUsage,
    ebceRebate: roundDecimals(ebceRebate),
    pgeCharges: roundDecimals(pgeCharges),
    ebceCharges: roundDecimals(ebceCharges),
    wouldBeCosts: roundDecimals(wouldBeCosts)
  };
};

export default getLatestPGEBill;
