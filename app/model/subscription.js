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
    roomType: {
      type: String,
      enum: [ 'USER', 'GROUP', 'CHANNEL' ],
    },
    pinned: { type: Date },
    mute: Boolean,
    removed: Boolean,
    blocked: Boolean,
    clearAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, index: true, required: true },
    createdAt: { type: Date, default: Date.now },
    readInboxMaxId: { type: Schema.Types.ObjectId, default: null },
    readHistoryMaxId: { type: Schema.Types.ObjectId, default: null },
  });

  SubscriptionSchema.methods.appendProps = function(props) {
    this.unreadCount = props ? props.unreadCount : 0;
    this.lastMessageId = props ? props.lastMessageId : this.readInboxMaxId;
  };
  SubscriptionSchema.methods.presentable = function() {
    return {
      roomId: this.roomId,
      chatId: this.chatId,
      role: this.role,
      pinned: this.pinned,
      mute: this.mute,
      clearAt: this.clearAt,
      createdAt: this.createdAt,
      readInboxMaxId: this.readInboxMaxId,
      readHistoryMaxId: this.readHistoryMaxId,
      unreadCount: this.unreadCount,
      lastMessageId: this.lastMessageId,
    };
  };

  return mongoose.model('Subscription', SubscriptionSchema, 'subscription');
};
