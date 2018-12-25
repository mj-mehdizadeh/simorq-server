'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose');

class SubscriptionService extends Service {
  findUserSubscribes(createdBy) {
    return this.ctx.model.Subscription.find({ createdBy }).select({ roomId: 1, chatId: 1, removed: 1 });
  }

  findUserSubscription(roomId, createdBy) {
    return this.ctx.model.Subscription.findOne({ roomId, createdBy });
  }

  async insertChatSubscribe(from, to) {
    const chatId = mongoose.Types.ObjectId();
    return this.ctx.model.Subscription.create({
      roomId: to.roomId,
      chatId,
      removed: true,
      createdBy: from.createdBy,
    }, {
      roomId: from.roomId,
      chatId,
      removed: true,
      createdBy: to.createdBy,
    });
  }

  insertSubscribe(roomId, createdBy, role) {
    return this.ctx.model.Subscription.create({
      roomId,
      createdBy,
      role,
    });
  }

  constructModel(params) {
    return new this.ctx.model.Subscription(params);
  }
}

module.exports = SubscriptionService;
