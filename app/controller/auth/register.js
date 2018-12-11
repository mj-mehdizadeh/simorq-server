'use strict';

const Controller = require('../../core/controller');

class RegisterController extends Controller {
  get rules() {
    return {
      phone_number: { type: 'number' },
      phone_hash: { type: 'string' },
      phone_code: { type: 'int' },
      title: { type: 'string' },
    };
  }

  async handle() {

    // validate send code
    const validCode = await this.ctx.service.sendCode.validateCode(
      this.getInput('phone_number'),
      this.getInput('phone_hash'),
      this.getInput('phone_code')
    );
    if (!validCode) {
      this.throwInvalidError('invalid_phone_code');
    }

    // validate phone_number
    if (!(await this.ctx.service.account.canRegister(this.getInput('phone_number')))) {
      this.throwInvalidError('invalid_phone_number');
    }

    // insert account
    const account = await this.ctx.service.account.insertAccount(this.getInput('phone_number'));

    // delete sendCode
    await this.ctx.service.sendCode.deleteCode(this.getInput('phone_number'));

    // insert new room
    const room = await this.ctx.service.room.insertRoom(this.getInput('title'), null, 'USER', account._id);

    // generate token
    account.roomId = room.id;
    await account.updateLoginHash();

    return {
      login_hash: account.signedLoginToken(),
    };
  }
}

module.exports = RegisterController;
