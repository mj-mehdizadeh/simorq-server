'use strict';

const Service = require('egg').Service;

class AccountService extends Service {

  findByPhoneNumber(phoneNumber) {
    return this.ctx.model.Account.findOne({ phoneNumber, isDeleted: false });
  }

  insertAccount(phoneNumber) {
    return this.ctx.model.Account.create({ phoneNumber });
  }

  async canLogin(phoneNumber) {
    const account = await this.ctx.model.Account.findOne({ phoneNumber });
    return account !== null;
  }

  async canRegister(phoneNumber) {
    const account = await this.ctx.model.Account.findOne({ phoneNumber });
    return account === null;
  }
}

module.exports = AccountService;
