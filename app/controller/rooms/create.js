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
      this.ctx.locals.oauth.token.accountId
    );
    return room.presentable();
  }
}

module.exports = CreateController;
