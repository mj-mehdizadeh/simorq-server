'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MessageSchema = new Schema({
    refType: {
      type: String,
      enum: ['CHAT', 'ROOM'],
    },
    refId: mongoose.Types.ObjectId,
    randomId: Number,
    type: {
      type: String,
      enum: ['PHOTO', 'VIDEO', 'VOICE', 'MUSIC', 'FILE', 'GIF', 'CONTACT', 'LOCATION', 'LINK'],
    },
    message: {type: String, maxLength: 4096},
    attachment: new Schema({
      id: {type: mongoose.Types.ObjectId},
      mimType: String,
      size: Number,
      width: Number,
      height: Number,
    }, {_id: false}),
    contact: new Schema({
      roomId: mongoose.Types.ObjectId,
      title: String,
      phoneNumber: [Number],
      email: [String],
    }, {_id: false}),
    location: new Schema({
      roomId: mongoose.Types.ObjectId,
      title: String,
      phoneNumber: [Number],
      email: [String],
    }, {_id: false}),
    forwardFrom: new Schema({
      roomId: mongoose.Types.ObjectId,
      messageId: mongoose.Types.ObjectId,
    }, {_id: false}),
    replyTo: mongoose.Types.ObjectId,
    deletedBy: [mongoose.Types.ObjectId],
    createdBy: mongoose.Types.ObjectId,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  });
  MessageSchema.index({refType: 1, refId: 1, randomId: 1}, {unique: true});

  return mongoose.model('Message', MessageSchema, 'message');
};
