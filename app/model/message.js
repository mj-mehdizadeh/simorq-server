'use strict';
const pick = require('lodash').pick;

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const MessageSchema = new Schema({
    chatId: { type: ObjectId, required: true },
    randomId: Number,
    type: {
      type: String,
      enum: [ 'PHOTO', 'VIDEO', 'VOICE', 'MUSIC', 'FILE', 'GIF', 'CONTACT', 'LOCATION', 'LINK' ],
    },
    text: { type: String, maxLength: 4096 },
    attachment: new Schema({
      id: { type: ObjectId },
      mimType: String,
      size: Number,
      width: Number,
      height: Number,
    }, { _id: false }),
    contact: new Schema({
      roomId: ObjectId,
      title: String,
      phoneNumber: [ Number ],
      email: [ String ],
    }, { _id: false }),
    location: new Schema({
      lat: Number,
      lan: Number,
    }, { _id: false }),
    forwardFrom: new Schema({
      roomId: ObjectId,
      messageId: ObjectId,
    }, { _id: false }),
    replyTo: ObjectId,
    deletedBy: [ ObjectId ],
    createdBy: { type: ObjectId, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  MessageSchema.index({ chatId: 1, randomId: 1 }, { unique: true });

  MessageSchema.methods.presentable = function() {
    return pick(this, [ 'id', 'chatId', 'randomId', 'type', 'text', 'attachment', 'contact', 'location', 'forwardFrom', 'replyTo', 'createdAt', 'updatedAt' ]);
  };

  return mongoose.model('Message', MessageSchema, 'message');
};
