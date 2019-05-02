'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;
const uniq = require('lodash').uniq;

class GetController extends Controller {

  async handle() {
    const { roomIds, roomId, chatId, skip, limit, username } = this.ctx.query;
    if (roomId) {
      return this.findRoomById(roomId);
    } else if (chatId) {
      return this.findRoomByChatId(chatId);
    } else if (username && username.length >= 3) {
      return this.findRoomByUsername(username, skip, limit);
    } else if (roomIds) {
      return this.findInRoomIds(roomIds);
    }
    this.throwInvalidError('invalid_params');
  }

  async findRoomById(roomId) {
    if (!this.ctx.helper.matchId(roomId)) {
      this.throwInvalidError('invalid_room_id');
    }
    const room = await this.ctx.service.room.findById(roomId);
    if (!room) {
      this.throwInvalidError('invalid_room_id');
    }
    const subscribes = await this.ctx.service.subscription.getRoomsSubscription([ room.id ], this.accountId);
    return this.ctx.service.subscription.getSubscribesRoom(subscribes, this.accountId, [ room ]);
  }

  async findRoomByChatId(chatId) {
    if (!this.ctx.helper.matchId(chatId)) {
      this.throwInvalidError('invalid_chat_id');
    }
    const subscribe = await this.ctx.service.subscription.findUserSubscriptionByChatId(chatId, this.accountId);
    if (!subscribe) {
      this.throwInvalidError('invalid_chat_id');
    }
    const room = await this.ctx.service.room.findById(subscribe.roomId);
    return this.ctx.service.subscription.getSubscribesRoom([ subscribe ], this.accountId, [ room ]);
  }

  async findRoomByUsername(username, skip, limit) {
    const rooms = await this.ctx.service.room.findUsername(username, skip, limit);
    const subscribes = await this.ctx.service.subscription.getRoomsSubscription(map(rooms, 'id'), this.accountId);
    return this.ctx.service.subscription.getSubscribesRoom(subscribes, this.accountId, rooms);
  }

  async findInRoomIds(roomIds) {
    try {
      const ids = JSON.parse(roomIds);
      ids.forEach(id => {
        if (!this.ctx.helper.matchId(id)) {
          this.throwInvalidError('invalid_room_id');
        }
      });
      return this.ctx.service.room.findInIds(uniq(ids));
    } catch (e) {
      this.throwInvalidError('invalid_room_ids');
    }
  }
}

module.exports = GetController;
