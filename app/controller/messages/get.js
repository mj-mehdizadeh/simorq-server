'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;

class GetController extends Controller {

  presentable(results) {
    return map(results, message => message.presentable());
  }

  async handle() {
    let chatId;
    const { roomId } = this.ctx.params;
    const { from, skip, limit, direction } = this.ctx.query;

    if (!this.ctx.helper.matchId(roomId)) {
      this.throwInvalidError('invalid_room_id');
    }
    const room = await this.ctx.service.room.findById(roomId);
    if (!room) {
      this.throwInvalidError('room_not_found');
    }

    if ([ 'GROUP', 'CHANNEL' ].includes(room.type) && room.availability === 'PUBLIC') {
      chatId = room.chatId;
    } else {
      const subscribe = await this.ctx.service.subscription.findUserSubscription(roomId, this.accountId);
      if (!subscribe) {
        this.throwInvalidError('room_not_found');
      }
      chatId = subscribe.chatId;
    }
    return this.ctx.service.message.getHistory(chatId, from, parseInt(skip) || 0, parseInt(limit) || 40, parseInt(direction) || -1);
  }
}

module.exports = GetController;
