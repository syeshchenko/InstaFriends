function User(params) {
  this.populateUser(params);
}

User.prototype.populateUser = function(params) {
  this.socialId = params.socialId;
  this.userName = params.userName;
  this.profilePicture = params.profilePicture;
  this.socialMediaType = params.socialMediaType;
  this.accessToken = params.accessToken;
  this.isActive = params.isActive;
  this.accountId = params.accountId;
}

module.exports = User;
