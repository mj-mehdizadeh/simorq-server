'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SubscriptionSchema = new Schema({
    roomId: {type: mongoose.Types.ObjectId, index: true},
    refId: {type: mongoose.Types.ObjectId, index: true},
    role: {
      type: String,
      enum: ['MEMBER', 'ADMIN', 'OWNER'],
    },
    createdBy: {type: mongoose.Types.ObjectId, index: true},
    createdAt: {type: Date, default: Date.now},
    lastSeen: {type: Date, default: Date.now},
  });

  return mongoose.model('Subscription', SubscriptionSchema, 'subscription');
};
