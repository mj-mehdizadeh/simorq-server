'use strict';

const Service = require('egg').Service;

class AccountService extends Service {

  findById(id) {
    return this.ctx.model.Account.findById(id);
  }

  findByPhoneNumber(phoneNumber) {
    return this.ctx.model.Account.findOne({ phoneNumber, isDeleted: false });
  }

  findInPhoneNumbers(phoneList) {
    return this.ctx.model.Account
      .find({ phoneNumber: phoneList })
      .select({ roomId: 1, phoneNumber: 1 });
  }

  insertAccount(phoneNumber) {
    return this.ctx.model.Account.create({ phoneNumber });
  }

  async canRegister(phoneNumber) {
    const account = await this.findByPhoneNumber(phoneNumber);
    return account === null;
  }

  constructModel(params) {
    return new this.ctx.model.Account(params);
  }
}

module.exports = AccountService;
