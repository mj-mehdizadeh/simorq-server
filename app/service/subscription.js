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
    this.join(subscribes[0]);
    this.join(subscribes[1]);
    return subscribes;
  }

  async insertSubscribe(roomId, createdBy, role) {
    const subscribe = await this.ctx.model.Subscription.create({
      roomId,
      createdBy,
      role,
    });
    this.join(subscribe);
  }

  join(subscribe) {
    const refType = subscribe.chatId ? 'chat' : 'room';
    const refId = subscribe.chatId ? subscribe.chatId : subscribe.roomId;
    this.ctx.io(refType).join(refId, subscribe.createdBy, refId);
  }

  publish(subscribe) {
    const refType = subscribe.chatId ? 'chat' : 'room';
    const refId = subscribe.chatId ? subscribe.chatId : subscribe.roomId;
    this.ctx.io(refType).emit(refId, 'update', subscribe.presentable());
  }

  constructModel(params) {
    return new this.ctx.model.Subscription(params);
  }
}

module.exports = SubscriptionService;
