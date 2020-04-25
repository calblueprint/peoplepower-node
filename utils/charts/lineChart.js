import Colors from '../../Colors';

const { PP_PINK, PP_GRAY } = Colors;

const generateLineChartForData = (months, trueCosts, wouldBeCosts) => {
  return {
    title: {
      text: ''
    },
    credits: {
      enabled: false
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
        color: PP_PINK
      },
      {
        name: '"Would-be" costs',
        data: wouldBeCosts,
        color: PP_GRAY
      }
    ],

    legend: {
      layout: 'horizontal',
      align: 'center',
      horizontalAlign: 'middle',
      color: PP_GRAY
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
