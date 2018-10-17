'use strict';

const Controller = require('../../core/controller');
const sha256Hex = require('../../core/security').sha256Hex;

class SendCodeController extends Controller {
  get rules() {
    return {
      phone_number: { type: 'string' },
    };
  }

  async handle() {
    const result = await this.ctx.service.sendCode.insertCode(this.getInput('phone_number'));
    this.sendSms(result);
    this.sendMessage(result);
    return {
      phone_hash: sha256Hex(result._id),
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
