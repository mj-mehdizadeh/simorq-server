'use strict';

const Service = require('egg').Service;

class MessageService extends Service {
  async newMessage(from, to, params) {
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
          { roomId: room.id, accountId: userRoom.createdBy },
          { roomId: userRoom.id, accountId: room.createdBy }
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

    await this.ctx.model.Message.create({
      refType: room.type === 'USER' ? 'CHAT' : 'ROOM',
      refId: room.type === 'USER' ? subscribe.chatId : room.id,
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
  }
}

module.exports = MessageService;
