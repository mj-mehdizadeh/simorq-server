'use strict';

const Controller = require('../../core/controller');

class GetController extends Controller {

  async handle() {
    const { skip, limit } = this.ctx.query;

    // find user subscribes
    const subscribes = await this.ctx.service.subscription.getSubscribes(this.accountId, skip || 0, limit || 40);
    if (!subscribes.length) {
      this.throwInvalidError('end_of_subscribes');
    }

    return this.ctx.service.subscription.getSubscribesRoom(subscribes, this.accountId);
  }
}

module.exports = GetController;
