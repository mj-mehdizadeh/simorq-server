'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose');
const map = require('lodash').map;
const find = require('lodash').find;
const pick = require('lodash').pick;

class SubscriptionService extends Service {
  findUserSubscribes(createdBy) {
    return this.ctx.model.Subscription.find({ createdBy })
      .select({ roomId: 1, chatId: 1, removed: 1 });
  }

  findUserSubscription(roomId, createdBy) {
    return this.ctx.model.Subscription.findOne({ roomId, createdBy });
  }

  findUserSubscriptionByChatId(chatId, createdBy, select = null) {
    return this.ctx.model.Subscription.findOne({ chatId, createdBy }).select(select);
  }

  getSubscribes(createdBy, skip, limit) {
    // todo sort by lastUpdate
    return this.ctx.model.Subscription.find({ createdBy })
      .skip(skip)
      .limit(limit);
  }

  getRoomsSubscription(roomIds, createdBy) {
    return this.ctx.model.Subscription.find({ roomId: { $in: roomIds }, createdBy });
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

  async getSubscribesRoom(subscribes, accountId, defaultRooms = null) {

    if (!subscribes.length) {
      return {
        rooms: defaultRooms ? map(defaultRooms, room => room.presentable()) : [],
        messages: [],
      };
    }

    // find subscribes props
    const subscribesAggregate = map(
      subscribes,
      subscribe => pick(
        subscribe, [
          'chatId',
          'readInboxMaxId',
        ])
    );
    const subscribeProps = await this.ctx.service.message.findSubscribeLast(subscribesAggregate, accountId);

    // append subscribe
    subscribes.forEach(sub => {
      sub.appendProps(find(subscribeProps, { _id: sub.chatId }));
    });

    // find subscribe rooms
    const rooms = defaultRooms || await this.ctx.service.room.findInIds(map(subscribes, 'roomId'));

    // subscribe last messages
    const lastMessageIds = map(subscribes, 'lastMessageId');
    const messages = await this.ctx.service.message.findIds(lastMessageIds);

    return {
      rooms: map(rooms, room => room.presentable(find(
        subscribes,
        sub => sub.roomId.toString() === room.id.toString()
      ))),
      messages: map(messages, message => message.presentable()),
    };
  }

  join(subscribe) {
    this.ctx.io()
      .joinAccount(subscribe.createdBy, subscribe.chatId);
  }

  publish(subscribe) {
    this.ctx.io()
      .emit(subscribe.chatId, 'update', subscribe.presentable());
  }

  constructModel(params) {
    return new this.ctx.model.Subscription(params);
  }
}

module.exports = SubscriptionService;
