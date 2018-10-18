'use strict';

const Controller = require('../../core/controller');

class LoginController extends Controller {
  get rules() {
    return {
      phone_number: { type: 'string' },
      phone_hash: { type: 'string' },
      code: { type: 'int' },
    };
  }

  async handle() {

    const validCode = await this.ctx.service.sendCode.validateCode(
      this.getInput('phone_number'),
      this.getInput('phone_hash'),
      this.getInput('code')
    );
    if (!validCode) {
      this.throwInvalidError('invalid_verification_code');
    }
    // validate phone_number
    // validate two-step
    // insert session and return a token
    return this.ctx.request.body;
  }
}

module.exports = LoginController;
