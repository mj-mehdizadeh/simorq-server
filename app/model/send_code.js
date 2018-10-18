'use strict';
const sha256Hex = require('../core/security').sha256Hex;

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SendCodeSchema = new Schema({
    phoneNumber: { type: Number },
    code: { type: Number },
    createdAt: { type: Date, default: Date.now },
  });
  SendCodeSchema.index({ phoneNumber: 1 }, { unique: true });
  SendCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

  SendCodeSchema.virtual('phoneHash').get(function() {
    return sha256Hex(this._id);
  });

  return mongoose.model('SendCode', SendCodeSchema, 'send_code');
};
