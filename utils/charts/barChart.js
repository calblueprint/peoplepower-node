// Include the exporter module

const generateBarChartForData = (dates, data) => {
  return {
    chart: {
      type: 'column'
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
        color: '#cd6795',
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

export default generateBarChartForData;
