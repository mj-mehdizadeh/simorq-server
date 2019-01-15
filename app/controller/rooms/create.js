'use strict';

const Controller = require('../../core/controller');

class CreateController extends Controller {
  get rules() {
    return {
      title: { type: 'string' },
      info: { type: 'string' },
      type: [ 'GROUP', 'CHANNEL' ],
    };
  }

  async handle() {
    const room = await this.ctx.service.room.insertRoom(
      this.getInput('title'),
      this.getInput('info'),
      this.getInput('type'),
      this.accountId
    );
    // insert owner subscription
    const subscribe = await this.ctx.service.subscription.insertSubscribe(room.id, this.accountId, 'OWNER', room.type);

    return room.presentable(subscribe);
  }
}

module.exports = CreateController;
