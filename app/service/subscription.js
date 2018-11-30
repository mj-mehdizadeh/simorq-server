'use strict';

const Service = require('egg').Service;

class SubscriptionService extends Service {
  findUserSubscribes(createdBy) {
    return this.ctx.model.Subscription.find({ createdBy }).select({ roomId: 1, refId: 1 });
  }
}

module.exports = SubscriptionService;
