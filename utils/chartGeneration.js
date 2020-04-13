import moment from 'moment';
import getBarChartForData from './charts/barChart';

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
  const startMoment = moment(bill.startDate).format('YYYY-MM-DD');
  const endMoment = moment(bill.endDate).format('YYYY-MM-DD');
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

const generateCostOverTimeChart = () => {};

export { generateCostOverTimeChart, generateGenerationDataChart };
