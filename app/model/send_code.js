'use strict';
const sha256Hex = require('../core/security').sha256Hex;

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SendCodeSchema = new Schema({
    phone_number: { type: String },
    code: { type: Number },
    created_at: { type: Date, default: Date.now },
  });

  SendCodeSchema.virtual('phone_hash').get(function() {
    return sha256Hex(this._id);
  });

  return mongoose.model('SendCode', SendCodeSchema, 'send_code');
};
