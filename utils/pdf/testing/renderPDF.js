const React = require('react');
const ReactDOM = require('react-dom');
const { PDFViewer } = require('@react-pdf/renderer');
const BillingTemplate = require('../BillingTemplate.js');
const {
  subscriber,
  solarProject,
  subscriberBill,
  prevBill
} = require('./data.js');

const App = () => (
  <PDFViewer>
    <BillingTemplate
      subscriber={subscriber}
      solarProject={solarProject}
      subscriberBill={subscriberBill}
      prevBill={prevBill}
    />
  </PDFViewer>
);

ReactDOM.render(<App />, document.getElementById('root'));
