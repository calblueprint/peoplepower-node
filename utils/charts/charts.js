// Include the exporter module
import exporter from 'highcharts-export-server';
import { writeFile } from 'fs';
import Constants from '../../Constants';

const saveChartToFile = (chart, fileName) => {
  return new Promise((resolve, reject) => {
    // Export settings
    const exportSettings = {
      type: 'png',
      outfile: fileName,
      options: chart
    };

    // Set up a pool of PhantomJS workers
    exporter.initPool({ timeoutThreshold: 10000 });

    setTimeout(() => {
      // Perform an export
      exporter.export(exportSettings, function(err, res) {
        // Kill the pool when we're done with it
        exporter.killPool();

        if (err) {
          reject(err);
        } else {
          console.log('Saving chart to file...');
          writeFile(
            `${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${fileName}.png`,
            res.data,
            'base64',
            function(error) {
              reject(error);
            }
          );

          resolve();
        }
      });
    }, 5000);
  });
};

export default saveChartToFile;
