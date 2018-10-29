'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContactSchema = new Schema({
    roomId: {type: Schema.Types.ObjectId},
    title: {type: String, maxlength: 64, required: true},
    phoneNumber: {type: Number, required: true},
    createdBy: {type: Schema.Types.ObjectId, required: true},
  });

  return mongoose.model('Contact', ContactSchema, 'contact');
};
