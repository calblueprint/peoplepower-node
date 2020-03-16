import dotenv from 'dotenv-safe';
import nodemailer from 'nodemailer';
import Constants from '../Constants';

dotenv.config(); // Set up environment variables

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_SERVER_EMAIL,
    pass: process.env.MAIL_SERVER_PASS
  }
});

// accepts an email object, sends the email, and returns the recipient's email
const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: `"${Constants.SENDER_NAME}" <${process.env.MAIL_SERVER_EMAIL}>`,
    to,
    subject,
    text,
    html
  });
  console.log(`Sent email to ${to} with subject ${subject}`);

  const sentEmailRecipient = info.envelope.to[0];
  return sentEmailRecipient;
};

export default sendEmail;
