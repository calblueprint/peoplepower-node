/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Document } from '@react-pdf/renderer';
import BillPageTwo from './BillPageTwo';
import BillPageOne from './BillPageOne';

export default class BillTemplate extends React.PureComponent {
  render() {
    return (
      <Document>
        <BillPageOne {...this.props} />
        <BillPageTwo {...this.props} />
      </Document>
    );
  }
}
