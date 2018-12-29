'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;

class GetController extends Controller {
  get rules() {
    return {
      skip: { type: 'number', required: false },
      limit: { type: 'number', required: false },
    };
  }

  presentable(results) {
    return {
      subscribes: map(results.subscribes, sub => sub.presentable()),
      rooms: map(results.rooms, room => room.presentable()),
    };
  }

  async handle() {
    const skip = this.getInput('skip', 0);
    const limit = this.getInput('limit', 20);
    const subscribes = await this.ctx.service.subscription.getSubscribes(this.accountId, skip, limit);
    const rooms = await this.ctx.service.room.findInIds(map(subscribes, 'roomId'));
    return {
      subscribes,
      rooms,
    };
  }
}

module.exports = GetController;
