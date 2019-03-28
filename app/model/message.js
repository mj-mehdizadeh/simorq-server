'use strict';

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
    attachment: app.mongoose.model('Files').schema,
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
    return {
      id: this.id,
      chatId: this.chatId,
      randomId: this.randomId,
      type: this.type,
      text: this.text,
      attachment: this.attachment ? this.attachment.presentable() : null,
      contact: this.contact,
      location: this.location,
      forwardFrom: this.forwardFrom,
      replyTo: this.replyTo,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  return mongoose.model('Message', MessageSchema, 'message');
};
