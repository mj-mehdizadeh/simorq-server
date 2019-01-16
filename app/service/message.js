'use strict';

const Service = require('egg').Service;
const random = require('lodash').random;

class MessageService extends Service {
  findById(id) {
    return this.ctx.model.Message.findById(id);
  }

  findLastIds(ids) {
    return this.ctx.model.Message.aggregate([
      { $match: { chatId: { $in: ids } } },
      { $group: { _id: '$chatId', id: { $max: '$_id' } } },
    ]);
  }

  findIds(ids) {
    return this.ctx.model.Message.find({ _id: { $in: ids } });
  }

  async newMessage(from, to, params, options = { publish: true }) {
    let attachment,
      subscribe,
      peerSubscribe;

    const room = await this.ctx.service.room.findById(to);
    if (room === null) {
      this.ctx.throwError('invalid_room');
    }

    subscribe = await this.ctx.service.subscription.findUserSubscription(to, from);
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
      const userRoom = await this.ctx.service.room.findUserRoom(from);
      if (subscribe === null) {
        const subscribes = await this.ctx.service.subscription.insertChatSubscribe(
          { roomId: userRoom.id, createdBy: userRoom.createdBy },
          { roomId: room.id, createdBy: room.createdBy }
        );
        subscribe = subscribes[0];
        peerSubscribe = subscribes[1];
      } else {
        peerSubscribe = await this.ctx.service.subscription.findUserSubscription(userRoom.id, room.createdBy);
      }
    }

    if (params.attachment) {
      attachment = await this.ctx.service.files.findByToken(params.attachment);
      attachment = attachment !== null ? attachment.presentable() : null;
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
      createdBy: from,
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
    this.ctx.io().emit(message.chatId, 'update', message.presentable());
  }
}

module.exports = MessageService;
