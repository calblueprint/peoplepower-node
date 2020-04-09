/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Document } from '@react-pdf/renderer';
import BillingTemplate1 from './BillingTemplate1';
import BillingTemplate2 from './BillingTemplate2';

export default class BillTemplate extends React.PureComponent {
  render() {
    return (
      <Document>
        <BillPageOne {...this.props} />
        <BillingTemplate2 {...this.props} />
      </Document>
    );
  }
}
