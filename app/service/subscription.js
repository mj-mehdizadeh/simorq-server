'use strict';

const Service = require('egg').Service;

class SubscriptionService extends Service {
  findUserSubscribes(createdBy) {
    return this.ctx.model.Subscription.find({ createdBy }).select({ roomId: 1, chatId: 1, removed: 1 });
  }

  async insertSubscribe(roomId, createdBy, role) {
    const existSubscription = await this.ctx.model.Subscription.findOne({ roomId, createdBy });
    if (existSubscription == null) {
      return this.ctx.model.Subscription.create({
        roomId,
        createdBy,
        role,
      });
    }
    return existSubscription;
  }
}

module.exports = SubscriptionService;
