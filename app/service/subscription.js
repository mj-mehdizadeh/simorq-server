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

  getSubscribes(createdBy, skip, limit) {
    // todo sort by lastUpdate
    return this.ctx.model.Subscription.find({ createdBy })
      .skip(skip)
      .limit(limit);
  }

  async insertChatSubscribe(from, to) {
    const chatId = mongoose.Types.ObjectId();
    const subscribes = await this.ctx.model.Subscription.create({
      roomType: 'USER',
      roomId: to.roomId,
      chatId,
      removed: true,
      createdBy: from.createdBy,
    }, {
      roomType: 'USER',
      roomId: from.roomId,
      chatId,
      removed: true,
      createdBy: to.createdBy,
    });
    this.join(subscribes[0]);
    this.join(subscribes[1]);
    return subscribes;
  }

  async insertSubscribe(roomId, createdBy, role, roomType) {
    const subscribe = await this.ctx.model.Subscription.create({
      roomId,
      chatId: roomId,
      createdBy,
      role,
      roomType,
    });
    this.join(subscribe);
    return subscribe;
  }

  join(subscribe) {
    this.ctx.io().joinAccount(subscribe.createdBy, subscribe.chatId);
  }

  publish(subscribe) {
    this.ctx.io().emit(subscribe.chatId, 'update', subscribe.presentable());
  }

  constructModel(params) {
    return new this.ctx.model.Subscription(params);
  }
}

module.exports = SubscriptionService;
