import { Tables, Columns } from '../airtable/schema';

module.exports = {
  [Tables.ProjectGroup]: {
    read: (projectGroup, authedUser) => {
      return (
        authedUser &&
        authedUser.fields['Project Group'] &&
        authedUser.fields['Project Group'].includes(projectGroup.id)
      );
    },
    write: (projectGroup, authedUser) => {
      return (
        authedUser &&
        authedUser.fields['Project Group'] &&
        authedUser.fields['Project Group'].includes(projectGroup.id) &&
        authedUser.fields['Admin Of'] &&
        authedUser.fields['Admin Of'].includes(projectGroup.id)
      );
    }
  },
  [Tables.Owner]: (owner, authedUser) => {
    return (
      // either you are trying to access your own record ...
      (authedUser && authedUser.fields.ID === owner.id) ||
      // or you're an admin and you're trying to access the record of owners
      // in a project group you're in
      (authedUser &&
        authedUser.fields['Admin Of'] &&
        owner.fields['Project Group'] &&
        owner.fields['Project Group'].length > 0 &&
        authedUser.fields['Admin Of'].includes(
          owner.fields['Project Group'][0] // ASSUMES Owners only ever belong to 1 project group
        ))
    );
  },

  // can only see payments that are associated with you
  [Tables.Payment]: (Payment, authedUser) => {
    return (
      authedUser &&
      authedUser.fields.Payments &&
      authedUser.fields.Payments.includes(Payment.id)
    );
  },

  // can only see subscriber bills that are associated with you
  [Tables.SubscriberBill]: (subscriberBill, authedUser) => {
    return (
      authedUser &&
      authedUser.fields['Subscriber Bills'] &&
      authedUser.fields['Subscriber Bills'].includes(subscriberBill.id)
    );
  },

  // [Tables.SolarProject]: {},
  [Tables.RateSchedule]: (rateSchedule, authedUser) => {
    return (
      authedUser &&
      authedUser.fields[Columns[Tables.Owner].rateScheduleId.name] &&
      authedUser.fields[Columns[Tables.Owner].rateScheduleId.name].includes(
        rateSchedule.id
      )
    );
  },
  [Tables.Announcement]: {
    read: (announcement, authedUser) => {
      return (
        authedUser &&
        authedUser.fields[Columns[Tables.Owner].projectGroupId.name] && // is in a project group
        authedUser.fields[Columns[Tables.Owner].projectGroupId.name].includes(
          announcement.fields[
            Columns[Tables.Announcement].projectGroupId.name
          ][0] // ASSUMES announcements only ever belong to 1 project group
        )
      );
    },
    [Tables.PledgeInvite]: {
      read: () => {
        return true;
      },
      write: (pledgeInvite, authedUser) => {
        return (
          authedUser &&
          authedUser.fields['Admin Of'] &&
          authedUser.fields['Admin Of'].includes(pledgeInvite.projectGroupId)
        );
      }
    }
    // TODO: write rules for announcements
    // only project group admins should be able to write to the Announcements table
    //   write: (announcement, authedUser) => {
    //     return (
    //       authedUser &&
    //       authedUser.fields[Columns[Tables.Owner].adminOfId.name] && // is in a project group
    //       announcement.fields[Columns[Tables.Announcement].projectGroupId.name] &&
    //       authedUser.fields[Columns[Tables.Owner].adminOfId.name].includes(
    //         announcement.fields[
    //           Columns[Tables.Announcement].projectGroupId.name
    //         ][0] // ASSUMES announcements only ever belong to 1 project group
    //       )
    //     );
    //   }
  }
  // TODO: Access control rules for Solar Project
};
