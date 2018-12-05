'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OAuthTokenSchema = new Schema({
    clientId: { type: String },
    accountId: { type: mongoose.Types.ObjectId, index: true },
    accessToken: { type: String, unique: true },
    refreshToken: { type: String, unique: true },
    accessTokenExpiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  });

  OAuthTokenSchema.methods.updateAccessToken = async function(accessToken) {
    this.set({ accessToken });
    return this.save();
  };

  return mongoose.model('OAuthToken', OAuthTokenSchema, 'oauth_token');
};
