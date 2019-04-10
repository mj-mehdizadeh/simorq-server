'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContactSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, index: true },
    title: { type: String, maxlength: 64, required: true },
    phoneNumber: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, index: true, required: true },
  });

  ContactSchema.index({ createdBy: 1, phoneNumber: 1 }, { unique: true });

  ContactSchema.methods.presentable = function() {
    return {
      roomId: this.roomId,
      title: this.title,
      phoneNumber: this.phoneNumber,
    };
  };

  return mongoose.model('Contact', ContactSchema, 'contact');
};
