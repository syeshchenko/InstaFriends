function User(params) {
  populateUser(params);
}

function populateUser(params) {
  this.id = params.id;
  this.username = params.username;
  this.profilePicture = params.profilePicture;
  this.socialMediaType = params.socialMediaType;
  this.accesToken = params.accesToken;
  this.isActive = params.isActive;
}

module.exports = User;
