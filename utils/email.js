import dotenv from 'dotenv-safe';
import nodemailer from 'nodemailer';
import Constants from '../Constants';

dotenv.config(); // Set up environment variables

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_SERVER_EMAIL,
    pass: process.env.MAIL_SERVER_PASS
  }
});

// accepts an email object, sends the email, and returns the recipient's email
const sendEmail = async email => {
  const info = await transporter.sendMail({
    from: `"${Constants.SENDER_NAME}" <${process.env.MAIL_SERVER_EMAIL}>`,
    ...email
  });
  console.log(`Sent email to ${email.to} with subject ${email.subject}`);

  const sentEmailRecipient = info.envelope.to[0];
  return sentEmailRecipient;
};

export default sendEmail;
