'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AccountSchema = new Schema({
    phoneNumber: { type: Number, index: true },
    email: { type: Date, default: null },
    password_hash: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  AccountSchema.index({ phoneNumber: 1 });

  return mongoose.model('Account', AccountSchema, 'account');
};
