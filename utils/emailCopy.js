import Constants from '../Constants';

require('dotenv-safe').config();

const { ADMIN_EMAIL } = process.env;
const HTML_LOGO = `<img src="${Constants.EMAIL_LOGO_SRC}"/><br/>`;
const PLAINTEXT_ADMIN_EMAIL_OPENER = `Dear Admin,\n\n`;
const PLAINTEXT_ADMIN_EMAIL_CLOSER = `\n\nSincerely,\nYour Friendly PeoplePower Server`;

const HTML_ADMIN_EMAIL_OPENER = `${HTML_LOGO}Dear Admin,<br/><br/>`;
const HTML_ADMIN_EMAIL_CLOSER = `<br/><br/>Sincerely,<br/>Your Friendly People Power Server`;

// Email Generators
export default {
  // Pledge Invite Email
  invite: (inviteLink, inviteEmail) => ({
    to: inviteEmail,
    subject: 'PP POWER invites you!!',
    text: `Welcome to People Power Solar Cooperative! To join, you can create your account via this link: ${inviteLink}`, // plain text body

    // HTML Version
    html: `${HTML_LOGO}<br/><h3>Welcome to People Power Solar Cooperative!</h3><br /><p>To join, you can create your account via this link: ${inviteLink}</p>` // html body
  })
};
