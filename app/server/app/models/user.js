function User(params) {
  this.populateUser(params);
}

User.prototype.populateUser = function(params) {
  this.id = params.id || null;
  this.socialId = params.social_id;
  this.userName = params.user_name;
  this.profilePicture = params.profile_picture;
  this.socialMediaType = params.social_media_type_id;
  this.accessToken = params.access_token;
  this.isActive = params.is_active;
  this.accountId = params.account_id;
  this.createdDate = null;
}

module.exports = User;
