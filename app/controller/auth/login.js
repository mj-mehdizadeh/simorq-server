'use strict';

const Controller = require('../../core/controller');
const pick = require('lodash').pick;

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
    // validate phone_number
    const account = await this.ctx.service.account.findByPhoneNumber(this.getInput('phone_number'));
    if (account == null) {
      this.throwInvalidError('invalid_phone_number');
    }
    // todo validate two-step
    // insert session and return a token
    const token = await this.ctx.service.oauthToken.insertToken(account._id);

    // delete sendCode
    await this.ctx.service.sendCode.deleteCode(this.getInput('phone_number'));

    return pick(token, [
      'accessToken',
      'refreshToken',
      'accessTokenExpiresOn',
    ]);
  }
}

module.exports = LoginController;
