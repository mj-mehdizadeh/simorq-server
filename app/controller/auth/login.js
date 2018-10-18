'use strict';

const Controller = require('../../core/controller');

class LoginController extends Controller {
  get rules() {
    return {
      phone_number: { type: 'number' },
      phone_hash: { type: 'string' },
      phone_code: { type: 'int' },
    };
  }

  async handle() {

    const validCode = await this.ctx.service.sendCode.validateCode(
      this.getInput('phone_number'),
      this.getInput('phone_hash'),
      this.getInput('phone_code')
    );
    if (!validCode) {
      this.throwInvalidError('invalid_phone_code');
    }
    // todo validate phone_number
    // todo validate two-step
    // todo insert session and return a token

    // delete sendCode
    await this.ctx.service.sendCode.deleteCode(this.getInput('phone_number'));

    return this.ctx.request.body;
  }
}

module.exports = LoginController;
