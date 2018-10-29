'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = mongoose.Schema.Types.ObjectId;

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
      id: {type: ObjectId},
      mimType: String,
      size: Number,
      width: Number,
      height: Number,
    }, {_id: false}),
    contact: new Schema({
      roomId: ObjectId,
      title: String,
      phoneNumber: [Number],
      email: [String],
    }, {_id: false}),
    location: new Schema({
      lat: Number,
      lan: Number,
    }, {_id: false}),
    forwardFrom: new Schema({
      roomId: ObjectId,
      messageId: ObjectId,
    }, {_id: false}),
    replyTo: ObjectId,
    deletedBy: [ObjectId],
    createdBy: ObjectId,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  });
  MessageSchema.index({refType: 1, refId: 1, randomId: 1}, {unique: true});

  return mongoose.model('Message', MessageSchema, 'message');
};
