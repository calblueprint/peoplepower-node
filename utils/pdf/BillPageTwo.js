import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import moment from 'moment';
import styles from './PDFStyles';

export default class BillPageTwo extends React.PureComponent {
  render() {
    const { subscriberBill, previousBills } = this.props;

    // Combine the bills and take the latest 12 and order them least to greatest
    const bills = [...previousBills, subscriberBill]
      .sort((a, b) => b.statementNumber - a.statementNumber)
      .filter((_, i) => i < 12)
      .reverse();
    const round = (x, y = 3) => x.toFixed(y);
    const sum = arr => round(arr.reduce((a, b) => a + b, 0), 2);

    const startMoment = moment(bills[bills.length - 1].startDate, 'YYYY-MM-DD');
    const totalEbceCharges = sum(bills.map(b => b.ebceCharges));
    const totalPgeCharges = sum(bills.map(b => b.pgeCharges));
    const totalPPCharges = sum(bills.map(b => b.currentCharges));
    const totalEbceCredits = sum(bills.map(b => b.ebceRebate));
    const totalRebates = sum(bills.map(b => b.estimatedRebate));
    const totalWouldBeCost = sum(bills.map(b => b.wouldBeCosts));
    const totalPaid = sum(
      bills.map(
        b =>
          b.ebceCharges +
          b.pgeCharges +
          b.currentCharges -
          b.ebceRebate -
          b.estimatedRebate
      )
    );
    const percentSavings = round((1 - totalPaid / totalWouldBeCost) * 100, 1);
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
              {startMoment.format('MMMM')} {startMoment.format('YYYY')} -
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
                ${totalPaid}
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
                ${totalWouldBeCost}
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
                {percentSavings}%
              </Text>
            </View>
          </View>
          <Text style={[styles.midTextBlue, styles.paddingTopLarge]}>
            Here&apos;s how we we calculated your ${totalPaid} cost of energy:
          </Text>
          <View style={[styles.paddingTop]}>
            <Text style={[styles.midTextBoldPink, styles.textCenter]}>
              ${totalEbceCharges} + ${totalPgeCharges} + ${totalPPCharges} - $
              {totalEbceCredits} - ${totalRebates} = ${totalPaid}
            </Text>
            <Text style={[styles.smallTextBlue, styles.textCenter]}>
              EBCE charges + PGE Charges + People Power Charges - EBCE NEM
              Credits - People Power Rebates = What you&apos;ve paid for energy
            </Text>
          </View>
          <View style={[styles.paddingTopLarge, styles.textCenter]}>
            <Text style={[styles.headerThisBlue, styles.textCenter]}>
              Your Costs Over Time
            </Text>
            <View>
              <Image
                src={`./temp/${subscriberBill.id}_chart2.png`}
                alt="Chart of what pou've paid versus what you would be charge from PGE"
                safePath="./temp"
                style={[styles.secondChart]}
              />
            </View>
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
