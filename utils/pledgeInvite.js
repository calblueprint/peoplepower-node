import { getPledgeInviteById } from '../airtable/request';
import EmailGenerators from './emailCopy';
import Constants from '../Constants';
import sendEmail from './email';

export const retrieveRecipientEmail = async inviteId => {
  const pledgeInvite = await getPledgeInviteById(inviteId);
  const { email: recipientEmail } = pledgeInvite;
  return recipientEmail;
};

export const sendInviteEmail = async inviteId => {
  const inviteLink = `${Constants.INVITE_BASE_URL}?${Constants.INVITE_PARAM}=${inviteId}`;
  const inviteEmail = await retrieveRecipientEmail(inviteId);
  const result = await sendEmail(
    EmailGenerators.invite(inviteLink, inviteEmail)
  );
  return result;
};
