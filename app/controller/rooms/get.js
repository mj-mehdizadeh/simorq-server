'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;

class GetController extends Controller {

  async handle() {
    let rooms = [];
    const { id } = this.ctx.params;
    const { skip, limit, username } = this.ctx.query;

    if (id) {
      if (!this.ctx.helper.matchId(id)) {
        this.throwInvalidError('invalid_room_id');
      }
      const room = await this.ctx.service.room.findById(id);
      if (!room) {
        this.throwInvalidError('invalid_room_id');
      }
      rooms.push(room);
    } else if (username && username.length >= 3) {
      rooms = await this.ctx.service.room.findUsername(username, skip, limit);
    }

    const subscribes = await this.ctx.service.subscription.getRoomsSubscription(map(rooms, 'id'), this.accountId);
    if (!subscribes.length) {
      return {
        rooms: map(rooms, room => room.presentable()),
        messages: [],
      };
    }
    return this.ctx.service.subscription.getSubscribesRoom(subscribes, this.accountId, rooms);
  }
}

module.exports = GetController;
