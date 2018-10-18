'use strict';

const Controller = require('../../core/controller');

class SendCodeController extends Controller {
  get rules() {
    return {
      phone_number: { type: 'number' },
    };
  }

  async handle() {
    const result = await this.ctx.service.sendCode.insertCode(this.getInput('phone_number'));
    this.sendSms(result);
    this.sendMessage(result);
    return {
      phone_hash: result.phoneHash,
    };
  }

  sendSms(object) {
    //
  }

  sendMessage(object) {
    //
  }
}

module.exports = SendCodeController;
