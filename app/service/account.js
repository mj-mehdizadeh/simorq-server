'use strict';

const Service = require('egg').Service;

class AccountService extends Service {

  findById(id) {
    return this.ctx.model.Account.findById(id)
  }

  findByPhoneNumber(phoneNumber) {
    return this.ctx.model.Account.findOne({ phoneNumber, isDeleted: false });
  }

  insertAccount(phoneNumber) {
    return this.ctx.model.Account.create({ phoneNumber });
  }

  async canRegister(phoneNumber) {
    const account = await this.findByPhoneNumber({ phoneNumber });
    return account === null;
  }
}

module.exports = AccountService;
