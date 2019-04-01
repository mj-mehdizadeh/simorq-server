'use strict';

const Service = require('egg').Service;

class AccountService extends Service {

  findById(id, select = null) {
    return this.ctx.model.Account.findById(id).select(select);
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

  editAccount(id, params) {
    return this.ctx.model.Account.updateOne({ _id: id }, params);
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
