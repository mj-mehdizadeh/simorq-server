'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SubscriptionSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, index: true, required: true },
    chatId: { type: Schema.Types.ObjectId, index: true },
    role: {
      type: String,
      enum: [ 'MEMBER', 'ADMIN', 'OWNER' ],
    },
    pinned: { type: Date },
    mute: Boolean,
    removed: Boolean,
    blocked: Boolean,
    clearAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, index: true, required: true },
    createdAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
  });

  SubscriptionSchema.methods.presentable = function() {
    return {
      roomId: this.roomId,
      chatId: this.chatId,
      role: this.role,
      pinned: this.pinned,
      mute: this.mute,
      clearAt: this.clearAt,
      createdAt: this.createdAt,
      lastSeen: this.lastSeen,
    };
  };

  return mongoose.model('Subscription', SubscriptionSchema, 'subscription');
};
