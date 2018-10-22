'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OAuthTokenSchema = new Schema({
    accountId: {type: mongoose.Types.ObjectId, index: true},
    accessToken: {type: String, unique: true},
    refreshToken: {type: String, unique: true},
    accessTokenExpiresOn: {type: Date},
    createdAt: {type: Date, default: Date.now},
  });

  OAuthTokenSchema.virtual('isTokenExpired').get(function () {
    const expire = new Date(this.accessTokenExpiresOn);
    return expire.getTime() < Date.now();
  });
  OAuthTokenSchema.virtual('isRefreshTokenExpired').get(function () {
    const expire = new Date(this.accessTokenExpiresOn);
    return expire.getTime() + app.config.oauth.refreshTokenExpiresTime < Date.now();
  });


  return mongoose.model('OAuthToken', OAuthTokenSchema, 'oauth_token');
};
