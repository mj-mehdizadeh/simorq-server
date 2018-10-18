'use strict';

const Controller = require('../../core/controller');

class RegisterController extends Controller {
  get rules() {
    return {
      phone_number: { type: 'number' },
      phone_hash: { type: 'string' },
      code: { type: 'int' },
      title: { type: 'string' },
    };
  }

  async handle() {

    // validate send code
    const validCode = await this.ctx.service.sendCode.validateCode(
      this.getInput('phone_number'),
      this.getInput('phone_hash'),
      this.getInput('code')
    );
    if (!validCode) {
      this.throwInvalidError('invalid_verification_code');
    }

    // validate phone_number
    if (!(await this.ctx.service.account.canRegister(this.getInput('phone_number')))) {
      this.throwInvalidError('invalid_phone_number');
    }

    // insert account
    await this.ctx.service.account.insertAccount(this.getInput('phone_number'));

    // delete sendCode
    await this.ctx.service.sendCode.deleteCode(this.getInput('phone_number'));

    // todo insert new room

    // todo generate token
    return this.ctx.request.body;
  }
}

module.exports = RegisterController;
