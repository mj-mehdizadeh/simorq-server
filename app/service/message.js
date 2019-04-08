'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose');
const random = require('lodash').random;
const map = require('lodash').map;

class MessageService extends Service {
  findById(id) {
    return this.ctx.model.Message.findById(id);
  }

  findSubscribeLast(items, createdBy) {
    const orQuery = map(items, item => {
      const query = { chatId: item.chatId, createdBy: { $ne: createdBy } };
      if (item.readInboxMaxId) {
        query._id = { $gt: item.readInboxMaxId };
      }
      return query;
    });
    return this.ctx.model.Message.aggregate([
      { $match: { $or: orQuery } },
      { $group: { _id: '$chatId', lastMessageId: { $max: '$_id' }, unreadCount: { $sum: 1 } } },
    ]);
  }

  findIds(ids) {
    return this.ctx.model.Message.find({ _id: { $in: ids } });
  }

  getHistory(chatId, from = null, skip = 0, limit = 40, sort = -1) {
    const query = { chatId };
    if (from) {
      query._id = sort === 1 ? { $gt: mongoose.Types.ObjectId(from) } : { $lt: mongoose.Types.ObjectId(from) };
    }
    return this.ctx.model.Message.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: sort });
  }

  async newMessage(from, roomId, params, options = { publish: true }) {
    let attachment,
      subscribe,
      peerSubscribe;

    const room = await this.ctx.service.room.findById(roomId);
    if (room === null) {
      this.ctx.throwError('invalid_room');
    }

    subscribe = await this.ctx.service.subscription.findUserSubscription(roomId, from.id);
    if (
      (subscribe === null && [ 'GROUP', 'CHANNEL' ].includes(room.type))
      ||
      (room.type === 'CHANNEL' && subscribe.role === 'MEMBER')
    ) {
      this.ctx.throwError('invalid_room_access');
    } else if (
      subscribe && room.type === 'USER' && subscribe.blocked
    ) {
      this.ctx.throwError('blocked_user');
    }

    if (room.type === 'USER') {
      if (subscribe === null) {
        const subscribes = await this.ctx.service.subscription.insertChatSubscribe(
          { roomId: from.roomId, createdBy: from.id },
          { roomId: room.id, createdBy: room.createdBy }
        );
        subscribe = subscribes[0];
        peerSubscribe = subscribes[1];
      } else {
        peerSubscribe = await this.ctx.service.subscription.findUserSubscription(from.roomId, room.createdBy);
      }
    }

    if (params.attachment) {
      attachment = await this.ctx.service.files.findByToken(params.attachment);
    }

    // todo forwardFrom

    const message = await this.ctx.model.Message.create({
      chatId: subscribe.chatId,
      randomId: params.randomId ? params.randomId : random(10000000000),
      text: params.text,
      type: params.type,
      attachment,
      contact: params.contact,
      location: params.location,
      replyTo: params.replyTo,
      createdBy: from.id,
      roomId: from.roomId,
    });

    if (subscribe.removed) {
      subscribe.removed = false;
      subscribe.save();
    }
    if (peerSubscribe && peerSubscribe.removed) {
      peerSubscribe.removed = false;
      peerSubscribe.save();
    }
    if (options.publish) {
      this.publish(message);
    }
    return message;
  }

  publish(message) {
    this.ctx.io()
      .emit(message.chatId, 'update', message.presentable());
  }
}

module.exports = MessageService;
