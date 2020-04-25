import Colors from '../../Colors';

const { PP_PINK } = Colors;

// Include the exporter module

const getBarChartForData = (dates, data) => {
  return {
    chart: {
      type: 'column'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Energy Production During Bill Period'
    },
    xAxis: {
      categories: dates
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Production (kWh)'
      }
    },

    plotOptions: {
      column: {
        color: PP_PINK,
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        showInLegend: false,
        data
      }
    ]
  };
};

export default getBarChartForData;
