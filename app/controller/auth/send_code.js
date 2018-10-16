'use strict';

const Controller = require('../../core/controller');

class SendCodeController extends Controller {
  get rules() {
    return {
      phoneNumber: { type: 'string' },
    };
  }
  async handle() {
    return this.ctx.request.body;
  }
}

module.exports = SendCodeController;
