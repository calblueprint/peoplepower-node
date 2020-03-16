require('dotenv-safe').config();

const { ADMIN_EMAIL } = process.env;
const HTML_LOGO = `<img src=""/>`;
const PLAINTEXT_ADMIN_EMAIL_OPENER = `Dear Admin,\n\n`;
const PLAINTEXT_ADMIN_EMAIL_CLOSER = `\n\nSincerely,\nYour Friendly PeoplePower Server`;

const HTML_ADMIN_EMAIL_OPENER = `${HTML_LOGO}Dear Admin,<br/><br/>`;
const HTML_ADMIN_EMAIL_CLOSER = `<br/>br/>Sincerely,<br/>Your Friendly PeoplePower Server`;

// Email Generators
export default {
  // Pledge Invite Email
  invite: (inviteLink, inviteEmail) => ({
    to: inviteEmail,
    subject: 'PP POWER invites you!!',
    text: `Welcome to People Power Solar Cooperative! To join, you can create your account via this link: ${inviteLink}`, // plain text body

    // HTML Version
    html: `${HTML_LOGO}<br/><h3>Welcome to People Power Solar Cooperative!</h3><br /><p>To join, you can create your account via this link: ${inviteLink}</p>` // html body
  }),

  // Generic Bill Error
  genericBillError: (subscriber, solarProject, errorMessage) => ({
    to: ADMIN_EMAIL,
    subject: 'Subscriber Bill Generation Failed',
    text: `${PLAINTEXT_ADMIN_EMAIL_OPENER}Bill Generation failed when generating bill for ${subscriber.name}. Their Subscriber ID in Airtable is ${subscriber.name}. They belong to the ${solarProject.name} project. Please check the server logs for issues and try again!\n\nError Message:${errorMessage}${PLAINTEXT_ADMIN_EMAIL_CLOSER}`,

    // HTML Version
    html: `${HTML_ADMIN_EMAIL_OPENER}Bill Generation failed when generating bill for ${subscriber.name}. Their Subscriber ID in Airtable is ${subscriber.name}. They belong to the ${solarProject.name} project. Please check the server logs for issues and try again!<br/><br/>Error Message:${errorMessage}${HTML_ADMIN_EMAIL_CLOSER}`
  }),

  // PDF Bill Error
  pdfBillError: (subscriber, solarProject) => ({
    to: ADMIN_EMAIL,
    subject: 'Subscriber Bill PDF Generation Failed',
    text: `${PLAINTEXT_ADMIN_EMAIL_OPENER}While generating a bill for ${subscriber.name} (ID: ${subscriber.id}, Solar Project: ${solarProject.name}), the PDF generation process failed. The bill has been created successfully in Airtable but without PDF. Please delete the record created in error, check the server logs for issues and try again!${PLAINTEXT_ADMIN_EMAIL_CLOSER}`,

    // HTML Version
    html: `${HTML_ADMIN_EMAIL_OPENER}While generating a bill for ${subscriber.name} (ID: ${subscriber.id}, Solar Project: ${solarProject.name}), the PDF generation process failed. The bill has been created successfully in Airtable but without PDF. Please delete the record created in error, check the server logs for issues and try again!${HTML_ADMIN_EMAIL_CLOSER}`
  }),

  // Stale PG&E Bill Found
  stalePGEBillError: (subscriber, solarProject) => ({
    to: ADMIN_EMAIL,
    subject: 'Subscriber Bill Generation Aborted',
    text: `${PLAINTEXT_ADMIN_EMAIL_OPENER}While generating a bill for ${subscriber.name} (ID: ${subscriber.id}, Solar Project: ${solarProject.name}), the generation process stopped because the subscriber has not had a new PG&E Billing Cycle since the last bill. This will not affect bill generation for other subscribers in the solar project.${PLAINTEXT_ADMIN_EMAIL_CLOSER}`,

    // HTML Version
    html: `${HTML_ADMIN_EMAIL_OPENER}While generating a bill for ${subscriber.name} (ID: ${subscriber.id}, Solar Project: ${solarProject.name}), the generation process stopped because the subscriber has not had a new PG&E Billing Cycle since the last bill. This will not affect bill generation for other subscribers in the solar project.${HTML_ADMIN_EMAIL_CLOSER}`
  }),

  // Couldn't find Enphase Data
  missingEnphaseDataError: (subscriber, solarProject, startDate, endDate) => ({
    to: ADMIN_EMAIL,
    subject: 'Subscriber Bill Generation Aborted',
    text: `${PLAINTEXT_ADMIN_EMAIL_OPENER}While generating a bill for ${subscriber.name} (ID: ${subscriber.id}, Solar Project: ${solarProject.name}), the generation process stopped because it could not find any associated Enphase production data. It was looking for data over the time frame specified in the subscriber's latest PG&E Bill: ${startDate} - ${endDate}. This is likely because you have not updated the server code to include a processing function for this subscriber. This also might be due to an error in Enphase parameters (System ID and User ID), which are stored on Airtable under the Solar Project record.${PLAINTEXT_ADMIN_EMAIL_CLOSER}`,

    // HTML Version
    html: `${HTML_ADMIN_EMAIL_OPENER}While generating a bill for ${subscriber.name} (ID: ${subscriber.id}, Solar Project: ${solarProject.name}), the generation process stopped because it could not find any associated Enphase production data. It was looking for data over the time frame specified in the subscriber's latest PG&E Bill: ${startDate} - ${endDate}. This is likely because you have not updated the server code to include a processing function for this subscriber. This also might be due to an error in Enphase parameters (System ID and User ID), which are stored on Airtable under the Solar Project record.${HTML_ADMIN_EMAIL_CLOSER}`
  }),

  // Success Message on Bill Creation
  billSuccess: (subscriber, solarProject, subscriberBill, approveLink) => ({
    to: ADMIN_EMAIL,
    subject: 'Successfully Generated New Subscriber Bill',
    text: `${PLAINTEXT_ADMIN_EMAIL_OPENER}A bill has been successfully generated for Account #${
      subscriber.subscriberAccountNumber
    }, belonging to ${subscriber.name} under the ${
      solarProject.name
    } project. Please look over the details below and click the link to approve. Approval will let the user make payments on the bill on the portal and will send them an email with the bill attached (Not Implemented). If there are issues, visit Airtable to either adjust values or delete bill (for retrying).  
    
New Bill Object: 
${JSON.stringify(subscriberBill, undefined, 4)}

Click To Approve: ${approveLink}${PLAINTEXT_ADMIN_EMAIL_CLOSER}`,

    // HTML Version
    html: `${HTML_ADMIN_EMAIL_OPENER}A bill has been successfully generated for Account #${
      subscriber.subscriberAccountNumber
    }, belonging to ${subscriber.name} under the ${
      solarProject.name
    } project. Please look over the details below and click the link to approve. Approval will let the user make payments on the bill on the portal and will send them an email with the bill attached. If there are issues, visit Airtable to either adjust values or delete bill (for retrying).  
    
New Bill Object: 
${JSON.stringify(subscriberBill, undefined, 4)}

<a href="${approveLink}">Click to Approve Bill</a>

Alternatively, copy the following into a browser: ${approveLink}${HTML_ADMIN_EMAIL_CLOSER}`
  })
};
