'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SendCodeSchema = new Schema({
    phone_number: { type: String },
    code: { type: Number },
    created_at: { type: Date, default: Date.now },
  });

  return mongoose.model('SendCode', SendCodeSchema, 'send_code');
};
