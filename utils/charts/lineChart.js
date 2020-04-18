const generateLineChartForData = (months, trueCosts, wouldBeCosts) => {
  return {
    title: {
      text: ''
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
        format: '${value:,.0f}'
      }
    },
    xAxis: {
      categories: months
    },
    series: [
      {
        name: "What You've Paid",
        data: trueCosts,
        color: '#cd6795'
      },
      {
        name: '"Would-be" costs',
        data: wouldBeCosts,
        color: '#747474'
      }
    ],

    legend: {
      layout: 'horizontal',
      align: 'center',
      horizontalAlign: 'middle',
      color: '#747474'
    },

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 200
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }
      ]
    }
  };
};

export default generateLineChartForData;
