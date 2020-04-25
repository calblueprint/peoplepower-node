module.exports = {
  'Project Group': {
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
  }
};
