'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;
const find = require('lodash').find;
const pick = require('lodash').pick;

class GetController extends Controller {
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
    const { skip, limit } = this.ctx.query;
    const subscribes = await this.ctx.service.subscription.getSubscribes(this.accountId, skip || 0, limit || 40);
    if (!subscribes.length) {
      this.throwInvalidError('end_of_subscribes');
    }
    const rooms = await this.ctx.service.room.findInIds(map(subscribes, 'roomId'));
    const subscribeProps = await this.ctx.service.message.findSubscribeLast(
      map(
        subscribes,
        subscribe => pick(subscribe, [ 'chatId', 'readInboxMaxId' ])
      )
    );
    const messages = await this.ctx.service.message.findIds(map(subscribeProps, 'lastMessageId'));
    return {
      subscribes,
      rooms,
      messages,
    };
  }
}

module.exports = GetController;
