import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import moment from 'moment';
import styles from './PDFStyles';
import Constants from '../../Constants';

export default class BillPageOne extends React.PureComponent {
  render() {
    const {
      subscriber,
      solarProject,
      subscriberBill,
      previousBills
    } = this.props;
    const prevBill =
      previousBills.length > 0
        ? previousBills[previousBills.length - 1]
        : {
            amountDue: 0,
            amountReceived: 0,
            balance: 0
          };
    const round = (x, y = 2) => parseFloat(x).toFixed(y);
    const roundAndCut = (x, y = 2) => Math.floor(x * 10 ** y) / 10 ** y;
    const formatAirtableDate = d =>
      moment(d, 'YYYY-MM-DD').format('MM/DD/YYYY');
    return (
      <Page style={styles.pdfContainer}>
        <View style={styles.pdf}>
          <View>
            <Image
              src="./assets/PPSC-logo-no-padding.png"
              alt="People Power Solar Cooperative Logo"
              safePath="./assets"
              style={[styles.logo, styles.paddingVertical]}
            />
          </View>
          <View style={[styles.flex, styles.justifyContent]}>
            <View style={[styles.left]}>
              <Text style={[styles.text]}>1428 Franklin St.</Text>
              <Text style={[styles.text]}>Oakland, CA 94612 </Text>
              <Text style={[styles.boldText]}>Questions? Please Email:</Text>
              <Text style={[styles.text]}>hello@peoplepowersolar.org</Text>
            </View>
            <View style={[styles.right]}>
              <View style={[styles.flex]}>
                <View style={[styles.left]}>
                  <Text style={[styles.boldText]}>Account No:</Text>
                  <Text style={[styles.boldText]}>Statement No:</Text>
                  <Text style={[styles.boldText]}>Statement Date:</Text>
                  <Text style={[styles.boldText]}>Due Date:</Text>
                </View>
                <View style={[styles.right, styles.paddingLeft]}>
                  <Text style={[styles.text]}>
                    {subscriber.subscriberAccountNumber || 0}
                  </Text>
                  <Text style={[styles.text]}>
                    {subscriberBill.statementNumber}
                  </Text>
                  <Text style={[styles.text]}>
                    {formatAirtableDate(subscriberBill.statementDate)}
                  </Text>
                  <Text style={[styles.text]}>
                    {formatAirtableDate(subscriberBill.dueDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={[styles.header, styles.paddingTop]}>Bill</Text>
            <Text style={[styles.midText]}>For Service during:</Text>
            <Text style={[styles.midTextBoldBlue]}>
              {formatAirtableDate(subscriberBill.startDate)} -
              {formatAirtableDate(subscriberBill.endDate)}
            </Text>
          </View>
          <View style={[styles.flex, styles.paddingTop]}>
            <View style={styles.left}>
              <Text style={[styles.boldText]}>Service For:</Text>
              <Text style={[styles.text]}>{subscriber.name}</Text>
              <Text style={[styles.text]}>
                {solarProject.street1} {solarProject.street2}
              </Text>
              <Text style={[styles.text]}>
                {solarProject.city},{solarProject.state} {solarProject.zipcode}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.boldText]}>Your Account Summary</Text>
              <View style={[styles.flex, styles.backgroundGray]}>
                <View style={styles.left}>
                  <Text style={[styles.text]}>
                    Amount Due on Previous Statement:
                  </Text>
                  <Text style={[styles.text]}>
                    Payment Recieved Since Last Statement:
                  </Text>
                  <Text style={[styles.text, styles.borderTop]}>
                    Previous Unpaid Balance:
                  </Text>
                  <Text style={[styles.text]}>
                    Current People Power Charges:
                  </Text>
                  <Text style={[styles.text]}>Excess Energy Rebates:</Text>
                </View>
                <View style={[styles.right, styles.paddingLeft]}>
                  <Text style={[styles.text]}>
                    ${round(prevBill.amountDue)}
                  </Text>
                  <Text style={[styles.text]}>
                    ${round(prevBill.amountReceived)}
                  </Text>
                  {/* <View style={border"><View/> */}
                  <Text style={[styles.text, styles.borderTop]}>
                    ${round(prevBill.balance)}
                  </Text>
                  <Text style={[styles.text]}>
                    ${round(subscriberBill.currentCharges)}
                  </Text>
                  <Text style={[styles.text]}>
                    -${round(subscriberBill.estimatedRebate)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.flex,
                  styles.totalBorder,
                  styles.backgroundGray,
                  styles.border
                ]}
              >
                <Text style={[styles.left, styles.pinkText]}>
                  Total Amount Due
                </Text>
                <Text style={[styles.right, styles.pinkText]}>
                  ${round(subscriberBill.amountDue)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.paddingTop}>
            <Text style={[styles.largeTextBold, styles.paddingBottom]}>
              Details of Charges
            </Text>
            <View style={[styles.flex]}>
              <Text style={[styles.boldText, styles.width25]}>Description</Text>
              <Text style={[styles.boldText, styles.width25]}>Production</Text>
              <Text style={[styles.boldText, styles.width25]}>Rate</Text>
              <Text style={[styles.boldText, styles.width25]}>Total Price</Text>
            </View>
            <View
              style={[
                styles.flex,
                styles.backgroundGray,
                styles.justifySpaceBetween
              ]}
            >
              <Text style={[styles.text, styles.width25]}>
                Energy Production
              </Text>
              <Text style={[styles.text, styles.width25]}>
                {subscriberBill.systemProduction} kWh
              </Text>
              <Text style={[styles.text, styles.width25]}>
                ${roundAndCut(subscriberBill.ppRate, 5)}
              </Text>
              <Text style={[styles.text, styles.width25]}>
                ${round(subscriberBill.currentCharges)}
              </Text>
            </View>
          </View>
          {/* <View style={border"><View/> */}
          <View
            style={[
              styles.flex,
              styles.justifySpaceBetween,
              styles.marginTop,
              styles.thinBorder
            ]}
          >
            <View style={styles.left}>
              <Text style={[styles.text]}>
                Excess Energy Produced During Bill Period:
              </Text>
              <Text style={[styles.text]}>
                People Power Excess Energy Rebate for Bill Period:
              </Text>
              <Text style={[styles.text]}>
                East Bay Community Energy (NEM) Credits for Bill Period:
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.text]}>
                {-subscriberBill.netPgeUsage} kWh
              </Text>
              <Text style={[styles.text]}>
                ${round(subscriberBill.estimatedRebate)}
              </Text>
              <Text style={[styles.text]}>${subscriberBill.ebceRebate}</Text>
            </View>
          </View>
          <View>
            <Image
              src={`./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}/${subscriberBill.id}_chart1.png`}
              alt="Power Generation Chart"
              safePath={`./${Constants.TEMP_BILL_SAVE_FOLDER_NAME}`}
              style={[styles.firstChart]}
            />
          </View>
        </View>
      </Page>
    );
  }
}
