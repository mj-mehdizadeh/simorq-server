'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AccountSchema = new Schema({
    phoneNumber: { type: Number, index: true },
    email: { type: String, maxlength: 256, trim: true, default: null },
    passwordHash: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Account', AccountSchema, 'account');
};
