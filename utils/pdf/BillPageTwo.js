import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import styles from './PDFStyles';

export default class BillPageTwo extends React.PureComponent {
  render() {
    const { subscriber, solarProject, subscriberBill, prevBill } = this.props;

    const startDate = new Date(subscriberBill.startDate);
    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    };
    const totalPaid = 537.38;
    const totalWouldBeCost = 662.89;
    const percentSavings = 1 - totalWouldBeCost / totalPaid;
    return (
      <Page style={styles.pdfContainer}>
        <View style={styles.pdf}>
          <Image
            src="./assets/PPSC-logo-no-padding.png"
            alt="People Power Solar Cooperative Logo"
            safePath="./assets"
            style={[styles.logo, styles.paddingVertical]}
          />
          <Text style={[styles.header]}>Energy Comparison</Text>
          <View style={[styles.paddingTop, styles.block]}>
            <Text style={[styles.inline, styles.text]}>
              Below is a summary of your energy costs and savings for your home,
              compared with your &quot;would-be&quot; costs with a local utility
              if you weren&apos;t with People Power. All costs from
            </Text>
            <Text style={[styles.inline, styles.boldText]}>
              {months[startDate.getMonth()]} 
              {' '}
              {startDate.getFullYear()}
              {' '}
              -
              Present.
            </Text>
          </View>
          <View
            style={[
              styles.textCenter,
              styles.flex,
              styles.paddingTop,
              styles.flexSameHeight
            ]}
          >
            <View style={[styles.width30]}>
              <Text
                style={[
                  styles.cardHeader,
                  styles.backgroundGray,
                  styles.textBoldBlue
                ]}
              >
                What you&apos;ve paid for energy:
              </Text>
              <Text
                style={[
                  styles.margintTopSmall,
                  styles.paddingVerticalLarge,
                  styles.backgroundGray,
                  styles.bigTextPink
                ]}
              >
                $
                {totalPaid}
              </Text>
            </View>
            <View style={[styles.width30]}>
              <Text
                style={[
                  styles.cardHeader,
                  styles.backgroundGray,
                  styles.textBoldBlue
                ]}
              >
                Your &quot;Would-Be&quot; charges w/o solar: *
              </Text>
              <Text
                style={[
                  styles.margintTopSmall,
                  styles.paddingVerticalLarge,
                  styles.backgroundGray,
                  styles.bigTextGray
                ]}
              >
                $
                {totalWouldBeCost}
              </Text>
            </View>
            <View style={[styles.width30]}>
              <Text
                style={[
                  styles.cardHeader,
                  styles.backgroundGray,
                  styles.textBoldBlue
                ]}
              >
                Percent Savings:
              </Text>
              <Text
                style={[
                  styles.margintTopSmall,
                  styles.paddingVerticalLarge,
                  styles.backgroundGray,
                  styles.bigTextPink
                ]}
              >
                {percentSavings}
                %
              </Text>
            </View>
          </View>
          <Text style={[styles.midTextBlue, styles.paddingTopLarge]}>
            Here&apos;s how we we calculated your $
            {totalPaid}
            {' '}
            cost of energy:
          </Text>
          <View style={[styles.paddingTop]}>
            <Text style={[styles.midTextBoldPink, styles.textCenter]}>
              $
              {totalEbceCharges}
              {' '}
              + $
              {totalPgeCharges}
              {' '}
              + $
              {totalPPCharges}
              {' '}
              - $
              {totalEbceCredits}
              {' '}
              - $
              {totalRebates}
              {' '}
              = $
              {totalPaid}
            </Text>
            <Text style={[styles.smallTextBlue, styles.textCenter]}>
              EBCE charges + PGE Charges + People Power Charges - EBCE NEM
              Credits - People Power Rebates = What you&apos;ve paid for energy
            </Text>
          </View>
          <View style={[styles.paddingTopLarge]}>
            <Text style={[styles.headerThisBlue, styles.textCenter]}>
              Your Costs Over Time
            </Text>
            <Image
              src=""
              alt="Chart of what pou've paid versus what you would be charge from PGE"
              safePath="./temp"
              style={[styles.paddingTop]}
            />
            <Text style={[[styles.smallText]]}>
              * Your &quot;Would-Be&quot; Charge from PG&amp;E is calculated as
              though you had been paying the current E-1 Residential Rate from
              PG&amp;E and EBCE.
            </Text>
          </View>
        </View>
      </Page>
    );
  }
}
