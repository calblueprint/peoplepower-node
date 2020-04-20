import moment from 'moment';
import getBarChartForData from './charts/barChart';
import generateLineChartForData from './charts/lineChart';

const enumerateDates = (startMoment, endMoment) => {
  const endString = endMoment.format('MM/DD/YYYY');
  const dateArray = [];
  while (startMoment.format('MM/DD/YYYY') !== endString) {
    dateArray.push(startMoment.format('MM/DD/YYYY'));
    startMoment.add(1, 'days');
  }
  dateArray.push(endString);
  return dateArray;
};

const generateGenerationDataChart = bill => {
  // Get array of date strings for chart generation
  const startMoment = moment(bill.startDate, 'YYYY-MM-DD');
  const endMoment = moment(bill.endDate, 'YYYY-MM-DD');
  const dateArray = enumerateDates(startMoment, endMoment);

  // Generate bar chart
  const generationData = bill.chartGenerationData
    .split(',')
    .map(x => Number(x));

  if (dateArray.length !== generationData.length) {
    throw new Error(
      'Mismatch between date array length and generation data length. Reporting error...'
    );
  }

  return getBarChartForData(dateArray, generationData);
};

const generateCostOverTimeChart = (prevBills, latestBill) => {
  console.log(`Latest bill ID is: ${latestBill.id}`);
  // Combine the bills and take the latest 12 and order them least to greatest
  const bills = [...prevBills, latestBill]
    .sort((a, b) => b.statementNumber - a.statementNumber)
    .filter((_, i) => i < 12)
    .reverse();
  const monthData = bills.map(b => b.startDate);
  const trueCosts = bills.map(
    b =>
      b.ebceCharges +
      b.pgeCharges +
      b.currentCharges -
      b.ebceRebate -
      b.estimatedRebate
  );
  const wouldBeCosts = bills.map(b => b.wouldBeCosts);
  return generateLineChartForData(monthData, trueCosts, wouldBeCosts);
};

export { generateCostOverTimeChart, generateGenerationDataChart };
