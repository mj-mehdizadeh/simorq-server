'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OAuthClientSchema = new Schema({
    clientId: { type: String, index: true },
    clientSecret: { type: String },
    createdAt: { type: Date, default: Date.now },
    grants: [ String ],
  });

  OAuthClientSchema.virtual('id').get(function() {
    return this.clientId;
  });

  return mongoose.model('OAuthClient', OAuthClientSchema, 'oauth_client');
};
