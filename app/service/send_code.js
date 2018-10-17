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
}

module.exports = SendCodeService;
