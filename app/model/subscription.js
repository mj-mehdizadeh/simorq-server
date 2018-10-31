'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SubscriptionSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, index: true, required: true },
    refId: { type: Schema.Types.ObjectId, index: true, required: true },
    role: {
      type: String,
      enum: [ 'MEMBER', 'ADMIN', 'OWNER' ],
    },
    createdBy: { type: Schema.Types.ObjectId, index: true, required: true },
    createdAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
  });

  return mongoose.model('Subscription', SubscriptionSchema, 'subscription');
};
