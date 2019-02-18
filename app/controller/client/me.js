'use strict';

const Controller = require('../../core/controller');

class MeController extends Controller {

  async handle() {
    return this.ctx.service.account.findById(this.accountId);
  }
}

module.exports = MeController;
