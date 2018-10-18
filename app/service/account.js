'use strict';

const Service = require('egg').Service;

class AccountService extends Service {

  findByPhoneNumber(phone_number) {
    return this.ctx.model.Account.findOne({ phone_number, is_deleted: false });
  }

  insertAccount(phone_number) {
    return this.ctx.model.Account.create({ phone_number });
  }

  async canLogin(phone_number) {
    const account = await this.ctx.model.Account.findOne({ phone_number });
    return account !== null;
  }

  async canRegister(phone_number) {
    const account = await this.ctx.model.Account.findOne({ phone_number });
    return account === null;
  }
}

module.exports = AccountService;
