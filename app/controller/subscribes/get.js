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

    // find user subscribes
    const subscribes = await this.ctx.service.subscription.getSubscribes(this.accountId, skip || 0, limit || 40);
    if (!subscribes.length) {
      this.throwInvalidError('end_of_subscribes');
    }

    // find subscribe rooms
    const subscribesRoomsId = map(subscribes, 'roomId');
    const rooms = await this.ctx.service.room.findInIds(subscribesRoomsId);

    // find subscribes props
    const subscribesAggregate = map(
      subscribes,
      subscribe => pick(
        subscribe, [
          'chatId',
          'readInboxMaxId',
        ])
    );
    const subscribeProps = await this.ctx.service.message.findSubscribeLast(subscribesAggregate, this.accountId);

    // append subscribe
    subscribes.forEach(sub => {
      sub.appendProps(find(subscribeProps, { _id: sub.chatId }));
    });

    // subscribe last messages
    const lastMessageIds = map(subscribes, 'lastMessageId');
    const messages = await this.ctx.service.message.findIds(lastMessageIds);

    return {
      subscribes,
      rooms,
      messages,
    };
  }
}

module.exports = GetController;
