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
    return {
      rooms: map(results.rooms, room => room.presentable(find(
        results.subscribes,
        sub => sub.roomId.toString() === room.id.toString()
      ))),
      messages: map(results.messages, message => message.presentable()),
    };
  }

  async handle() {
    const skip = this.getInput('skip', 0);
    const limit = this.getInput('limit', 20);
    const subscribes = await this.ctx.service.subscription.getSubscribes(this.accountId, skip, limit);
    const rooms = await this.ctx.service.room.findInIds(map(subscribes, 'roomId'));
    const lastIds = await this.ctx.service.message.findLastIds(map(subscribes, 'chatId'));
    const messages = await this.ctx.service.message.findIds(map(lastIds, 'id'));
    return {
      subscribes,
      rooms,
      messages,
    };
  }
}

module.exports = GetController;
