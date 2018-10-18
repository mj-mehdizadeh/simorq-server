'use strict';

const Service = require('egg').Service;
const random = require('lodash').random;

class SendCodeService extends Service {

  find(phone_number) {
    return this.ctx.model.SendCode.findOne({ phone_number });
  }

  async insertCode(phone_number) {
    let model = await this.find(phone_number);
    if (model == null) {
      const rand = random(10000, 99999);
      model = await this.ctx.model.SendCode.create({ phone_number, code: rand });
    }
    return model;
  }

  async validateCode(phone_number, phone_hash, code) {
    const insertCode = await this.ctx.service.sendCode.find(phone_number);
    return (
      insertCode != null
      &&
      insertCode.code === code
      &&
      insertCode.phone_hash === phone_hash
    );
  }
}

module.exports = SendCodeService;
