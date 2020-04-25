import { StyleSheet, Font } from '@react-pdf/renderer';
import Colors from '../../Colors';

const { PP_LIGHT_GRAY, PP_GRAY, PP_BLUE, PP_PINK, PP_DAVYS_GRAY } = Colors;

Font.register({
  family: 'Open Sans',
  src: './assets/fonts/OpenSans-Regular.ttf'
});
Font.register({
  family: 'Open Sans Bold',
  src: './assets/fonts/OpenSans-Bold.ttf'
});

export default StyleSheet.create({
  justifySpaceBetween: {
    justifyContent: 'space-between'
  },
  totalBorder: {
    border: '1px solid black'
  },
  backgroundGray: {
    backgroundColor: PP_LIGHT_GRAY
  },
  pdfContainer: {
    height: '100%',
    margin: '16px 24px',
    width: 50
  },
  pdf: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    width: '90%'
  },
  border: {
    border: '1 solid #555'
  },
  borderTop: {
    paddingTop: 3,
    borderTop: '1 solid #555'
  },
  marginTop: {
    marginTop: 10
  },
  left: {
    float: 'left'
  },
  right: {
    float: 'right'
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  logo: {
    width: '30%'
  },
  paddingVertical: {
    padding: '10px 0'
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    color: PP_GRAY,
    fontFamily: 'Open Sans'
  },
  boldText: {
    fontSize: 12,
    lineHeight: 1.5,
    color: PP_DAVYS_GRAY,
    fontFamily: 'Open Sans Bold'
  },
  lineHeight24: {
    lineHeight: 1.5
  },
  paddingTop: {
    paddingTop: '16px'
  },
  pinkText: {
    color: PP_PINK,
    fontSize: 14,
    padding: 3,
    fontFamily: 'Open Sans Bold'
  },
  midText: {
    fontSize: 14,
    lineHeight: 1.5,
    color: PP_DAVYS_GRAY,
    fontFamily: 'Open Sans'
  },
  midTextBold: {
    fontSize: 14,
    lineHeight: 1.5,
    color: PP_DAVYS_GRAY,
    fontFamily: 'Open Sans Bold'
  },
  midTextBoldBlue: {
    fontSize: 14,
    lineHeight: 1.5,
    color: PP_DAVYS_GRAY,
    fontFamily: 'Open Sans Bold'
  },
  largeTextBold: {
    fontSize: 16,
    lineHeight: 1.5,
    color: PP_DAVYS_GRAY,
    fontFamily: 'Open Sans Bold'
  },
  header: {
    fontFamily: 'Open Sans Bold',
    fontSize: 24,
    color: PP_BLUE
  },
  paddingBottom: {
    paddingBottom: 5
  },
  paddingLeft: {
    paddingLeft: 40
  },
  width25: {
    width: '25%'
  },
  thinBorder: {
    borderTop: '.001 solid #eee',
    borderBottom: '.01 solid #eee'
  },

  // new styling
  inline: {
    display: 'inline-block'
  },
  width30: {
    width: '30%'
  },
  bigTextPink: {
    fontFamily: 'Open Sans Bold',
    fontSize: 24,
    color: PP_PINK
  },
  bigTextGray: {
    fontFamily: 'Open Sans Bold',
    fontSize: 24,
    color: PP_GRAY
  },
  textBoldBlue: {
    fontSize: 12,
    lineHeight: 1.5,
    color: PP_BLUE,
    fontFamily: 'Open Sans Bold'
  },
  midTextBlue: {
    fontSize: 14,
    lineHeight: 1.5,
    color: PP_BLUE,
    fontFamily: 'Open Sans'
  },
  midTextBoldPink: {
    fontSize: 14,
    lineHeight: 1.5,
    color: PP_PINK,
    fontFamily: 'Open Sans Bold'
  },
  smallTextBold: {
    fontSize: 8,
    lineHeight: 1.5,
    color: PP_GRAY,
    fontFamily: 'Open Sans Bold'
  },
  smallText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: PP_GRAY,
    fontFamily: 'Open Sans'
  },
  textCenter: {
    textAlign: 'center'
  },
  flexSameHeight: {
    gridAutoRows: '1fr'
  },
  smallTextBlue: {
    fontSize: 8,
    lineHeight: 1.5,
    color: PP_BLUE,
    fontFamily: 'Open Sans'
  },
  headerThisBlue: {
    fontFamily: 'Open Sans',
    fontSize: 24,
    color: PP_BLUE
  },
  cardHeader: {
    padding: '15px',
    minHeight: '65px'
  },
  margintTopSmall: {
    marginTop: '5px'
  },
  paddingVerticalLarge: {
    padding: '15px 0'
  },
  marginHorizontal: {
    margin: '0 5rem 0 0'
  },
  paddingTopLarge: {
    padding: '20px 0 0 0'
  },
  firstChart: {
    width: '300px',
    paddingTop: '16px',
    marginLeft: '100px'
  },
  secondChart: {
    width: '400px',
    paddingTop: '16px',
    marginLeft: '60px'
  }
});
