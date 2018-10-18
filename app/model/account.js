'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AccountSchema = new Schema({
    phone_number: { type: Number, index: true },
    email: { type: Date, default: null },
    password_hash: { type: Date, default: null },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });
  AccountSchema.index({ phone_number: 1 });

  return mongoose.model('Account', AccountSchema, 'account');
};
