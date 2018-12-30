'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;
const find = require('lodash').find;

class GetController extends Controller {
  get rules() {
    return {
      skip: { type: 'number', required: false },
      limit: { type: 'number', required: false },
    };
  }

  presentable(results) {
    return map(results.rooms, room => room.presentable(find(
      results.subscribes,
      sub => sub.roomId.toString() === room.id.toString()
    )));
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
