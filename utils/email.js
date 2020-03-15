import dotenv from 'dotenv-safe';
import nodemailer from 'nodemailer';
import { getPledgeInviteById } from '../airtable/request';

dotenv.config(); // Set up environment variables

const SENDER_NAME = ''; // specify the name of the person sending an email, for example: "Nick Wong ⚡️🔋"

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_SERVER_EMAIL,
    pass: process.env.MAIL_SERVER_PASS
  }
});

const retrieveRecipientEmail = async RECORD_ID => {
  const pledgeInvite = await getPledgeInviteById(RECORD_ID);
  const { email: recipientEmail } = pledgeInvite;
  return recipientEmail;
};

// accepts an email object, sends the email, and returns the recipient's email
const sendEmail = async email => {
  const { to, subject, text, html } = email;

  const info = await transporter.sendMail({
    from: `"${SENDER_NAME}" <${process.env.MAIL_SERVER_EMAIL}>`,
    to,
    subject,
    text,
    html
  });

  const sentEmailRecipient = info.envelope.to[0];
  return sentEmailRecipient;
};

const sendInviteEmail = async RECORD_ID => {
  const baseUrl = 'https://peoplepower.netlify.com/onboarding';
  const inviteParameter = `?token=${RECORD_ID}`;
  const inviteLink = baseUrl + inviteParameter;

  const inviteEmail = {
    to: await retrieveRecipientEmail(RECORD_ID),
    subject: 'PP POWER invites you!!',
    text: `Welcome to People Power Solar Cooperative! To join, you can create your account via this link: ${inviteLink}`, // plain text body
    html: `<h3>Welcome to People Power Solar Cooperative!</h3><br /><p>To join, you can create your account via this link: ${inviteLink}</p>` // html body
  };

  const emailSent = await sendEmail(inviteEmail);

  return emailSent;
};

export default sendInviteEmail;
