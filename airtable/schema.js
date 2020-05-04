/*
    THIS IS A GENERATED FILE
    Changes might be overwritten in the future, edit with caution!
*/

export const Tables = {
  Owner: 'Owner',
  ProjectGroup: 'Project Group',
  Announcement: 'Announcement',
  SolarProject: 'Solar Project',
  SubscriberBill: 'Subscriber Bill',
  RateSchedule: 'Rate Schedule',
  PledgeInvite: 'Pledge Invite',
  Payment: 'Payment',
  InvestmentBreakdown: 'Investment Breakdown',
  TestDevelopment: 'Test (Development)'
};

export const Columns = {
  Owner: {
    primaryKey: { name: `Primary Key`, type: `formula` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    projectGroupId: { name: `Project Group`, type: `foreignKey-one` },
    paymentIds: { name: `Payments`, type: `foreignKey-many` },
    ownerTypes: { name: `Owner Types`, type: `multiSelect` },
    id: { name: `ID`, type: `formula` },
    subscriberBillIds: { name: `Subscriber Bills`, type: `foreignKey-many` },
    adminOfId: { name: `Admin Of`, type: `foreignKey-one` },
    numberOfShares: { name: `Number of Shares`, type: `number` },
    isReceivingDividends: { name: `Is Receiving Dividends?`, type: `checkbox` },
    solarProjectId: { name: `Solar Project`, type: `foreignKey-one` },
    firstName: { name: `First Name`, type: `text` },
    lastName: { name: `Last Name`, type: `text` },
    email: { name: `Email`, type: `text` },
    alternateEmail: { name: `Alternate Email`, type: `text` },
    permanentStreet1: { name: `Permanent Street 1`, type: `text` },
    permanentStreet2: { name: `Permanent Street 2`, type: `text` },
    permanentCity: { name: `Permanent City`, type: `text` },
    permanentState: { name: `Permanent State`, type: `text` },
    permanentZipcode: { name: `Permanent Zipcode`, type: `text` },
    mailingStreet1: { name: `Mailing Street 1`, type: `text` },
    mailingStreet2: { name: `Mailing Street 2`, type: `text` },
    mailingCity: { name: `Mailing City`, type: `text` },
    mailingState: { name: `Mailing State`, type: `text` },
    mailingZipcode: { name: `Mailing Zipcode`, type: `text` },
    phoneNumber: { name: `Phone Number`, type: `phone` },
    onboardingStep: { name: `Onboarding Step`, type: `number` },
    password: { name: `Password`, type: `text` },
    announcementIds: { name: `Announcements`, type: `foreignKey-many` },
    name: { name: `Name`, type: `formula` },
    permanentAddress: { name: `Permanent Address`, type: `formula` },
    mailingAddress: { name: `Mailing Address`, type: `formula` },
    mailingAddressSame: { name: `Mailing Address Same`, type: `checkbox` },
    bylaw1: { name: `Bylaw 1`, type: `checkbox` },
    bylaw2: { name: `Bylaw 2`, type: `checkbox` },
    certifyPermanentAddress: {
      name: `Certify Permanent Address`,
      type: `checkbox`
    },
    rateScheduleId: { name: `Rate Schedule`, type: `foreignKey-one` },
    latestBillNumber: { name: `Latest Bill Number`, type: `rollup` },
    meterId: { name: `Meter ID`, type: `text` },
    isSuperAdmin: { name: `Is Super Admin?`, type: `checkbox` },
    pledgeInviteId: { name: `Pledge Invite`, type: `foreignKey-one` },
    subscriberAccountNumber: {
      name: `Subscriber Account Number`,
      type: `number`
    }
  },
  'Project Group': {
    primaryKey: { name: `Primary Key`, type: `formula` },
    ownerIds: { name: `Owners`, type: `foreignKey-many` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    isPublic: { name: `Is Public?`, type: `checkbox` },
    isTakingPledges: { name: `Is Taking Pledges?`, type: `checkbox` },
    name: { name: `Name`, type: `text` },
    solarProjectIds: { name: `Solar Projects`, type: `foreignKey-many` },
    adminIds: { name: `Admins`, type: `foreignKey-many` },
    announcementIds: { name: `Announcements`, type: `foreignKey-many` },
    street1: { name: `Street 1`, type: `text` },
    street2: { name: `Street 2`, type: `text` },
    state: { name: `State`, type: `text` },
    zipcode: { name: `Zipcode`, type: `text` },
    city: { name: `City`, type: `text` },
    description: { name: `Description`, type: `text` },
    latitude: { name: `Latitude`, type: `number` },
    longitude: { name: `Longitude`, type: `number` },
    isDefault: { name: `Is Default?`, type: `checkbox` },
    id: { name: `ID`, type: `formula` },
    address: { name: `Address`, type: `formula` },
    pledgeInvitIds: { name: `Pledge Invite`, type: `foreignKey-many` }
  },
  Announcement: {
    primaryKey: { name: `Primary Key`, type: `formula` },
    link: { name: `Link`, type: `text` },
    attachments: { name: `Attachments`, type: `multipleAttachment` },
    projectGroupId: { name: `Project Group`, type: `foreignKey-one` },
    authorId: { name: `Author`, type: `foreignKey-one` },
    message: { name: `Message`, type: `multilineText` },
    eventType: { name: `Event type`, type: `select` },
    id: { name: `ID`, type: `formula` },
    title: { name: `Title`, type: `text` },
    isGlobal: { name: `Is Global?`, type: `checkbox` }
  },
  'Solar Project': {
    primaryKey: { name: `Primary Key`, type: `formula` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    name: { name: `Name`, type: `text` },
    address: { name: `Address`, type: `formula` },
    status: { name: `Status`, type: `select` },
    projectGroupId: { name: `Project Group`, type: `foreignKey-one` },
    street1: { name: `Street 1`, type: `text` },
    street2: { name: `Street 2`, type: `text` },
    city: { name: `City`, type: `text` },
    state: { name: `State`, type: `text` },
    zipcode: { name: `Zipcode`, type: `text` },
    id: { name: `ID`, type: `formula` },
    subscriberIds: { name: `Subscribers`, type: `foreignKey-many` },
    enphaseSystemId: { name: `Enphase System ID`, type: `text` },
    enphaseUserId: { name: `Enphase User ID`, type: `text` },
    subscriberBilIds: { name: `Subscriber Bill`, type: `foreignKey-many` },
    monthlyProductionData: { name: `Monthly Production Data`, type: `text` }
  },
  'Subscriber Bill': {
    primaryKey: { name: `Primary Key`, type: `formula` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    subscriberId: { name: `Subscriber`, type: `foreignKey-one` },
    statementDate: { name: `Statement Date`, type: `date` },
    startDate: { name: `Start Date`, type: `date` },
    endDate: { name: `End Date`, type: `date` },
    rateScheduleId: { name: `Rate Schedule`, type: `foreignKey-one` },
    estimatedRebate: { name: `Estimated Rebate`, type: `number` },
    balanceOnPreviousBill: { name: `Balance on Previous Bill`, type: `number` },
    paymentIds: { name: `Payments`, type: `foreignKey-many` },
    amountDue: { name: `Amount Due`, type: `number` },
    id: { name: `ID`, type: `formula` },
    statementNumber: { name: `Statement Number`, type: `number` },
    netPgeUsage: { name: `Net PGE Usage`, type: `number` },
    ebceRebate: { name: `EBCE Rebate`, type: `number` },
    systemProduction: { name: `System Production`, type: `number` },
    currentCharges: { name: `Current Charges`, type: `number` },
    balance: { name: `Balance`, type: `formula` },
    amountReceived: { name: `Amount Received`, type: `rollup` },
    status: { name: `Status`, type: `select` },
    solarProjectId: { name: `Solar Project`, type: `foreignKey-one` },
    billPdf: { name: `Bill PDF`, type: `multipleAttachment` },
    dueDate: { name: `Due Date`, type: `date` },
    chartGenerationData: { name: `Chart Generation Data`, type: `text` },
    wouldBeCosts: { name: `Would Be Costs`, type: `number` },
    pgeCharges: { name: `PGE Charges`, type: `number` },
    ebceCharges: { name: `EBCE Charges`, type: `number` },
    ppRate: { name: `PP Rate`, type: `lookup` },
    rebateRate: { name: `Rebate Rate`, type: `lookup` }
  },
  'Rate Schedule': {
    primaryKey: { name: `Primary Key`, type: `formula` },
    subscriberBilIds: { name: `Subscriber Bill`, type: `foreignKey-many` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    rate: { name: `Rate`, type: `number` },
    rebateRate: { name: `Rebate Rate`, type: `number` },
    id: { name: `ID`, type: `formula` },
    subscriberIds: { name: `Subscribers`, type: `foreignKey-many` },
    status: { name: `Status`, type: `select` }
  },
  'Pledge Invite': {
    primaryKey: { name: `Primary Key`, type: `formula` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    firstName: { name: `First Name`, type: `text` },
    lastName: { name: `Last Name`, type: `text` },
    shareAmount: { name: `Share Amount`, type: `number` },
    wantsDividends: { name: `Wants Dividends?`, type: `checkbox` },
    phoneNumber: { name: `Phone Number`, type: `phone` },
    email: { name: `Email`, type: `text` },
    id: { name: `ID`, type: `formula` },
    projectGroupId: { name: `Project Group`, type: `foreignKey-one` },
    ownerId: { name: `Owner`, type: `foreignKey-one` },
    status: { name: `Status`, type: `select` }
  },
  Payment: {
    primaryKey: { name: `Primary Key`, type: `formula` },
    dateCreated: { name: `Date Created`, type: `formula` },
    dateUpdated: { name: `Date Updated`, type: `formula` },
    ownerId: { name: `Owner`, type: `foreignKey-one` },
    type: { name: `Type`, type: `select` },
    amount: { name: `Amount`, type: `number` },
    subscriberBillId: { name: `Subscriber Bill`, type: `foreignKey-one` },
    paypalOrderId: { name: `Paypal Order ID`, type: `text` },
    paypalPayerId: { name: `Paypal Payer ID`, type: `text` },
    currencyCode: { name: `Currency Code`, type: `text` },
    payerAddress: { name: `Payer Address`, type: `text` },
    payerFullName: { name: `Payer Full Name`, type: `text` },
    payerEmail: { name: `Payer Email`, type: `text` },
    id: { name: `ID`, type: `formula` }
  },
  'Investment Breakdown': {
    categoryName: { name: `Category Name`, type: `text` },
    percentage: { name: `Percentage`, type: `number` },
    color: { name: `Color`, type: `text` }
  },
  'Test (Development)': {
    name: { name: `Name`, type: `text` },
    tag: { name: `Tag`, type: `text` },
    id: { name: `ID`, type: `formula` }
  }
};
