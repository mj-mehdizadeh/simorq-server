'use strict';

const Service = require('egg').Service;
const random = require('lodash').random;

class SendCodeService extends Service {

  find(phoneNumber) {
    return this.ctx.model.SendCode.findOne({ phoneNumber });
  }

  async insertCode(phoneNumber) {
    let model = await this.find(phoneNumber);
    if (model == null) {
      const rand = this.app.config.env === 'unittest' ? 12345 : random(10000, 99999);
      model = await this.ctx.model.SendCode.create({ phoneNumber, code: rand });
    }
    return model;
  }

  async validateCode(phoneNumber, phoneHash, code) {
    const insertCode = await this.ctx.service.sendCode.find(phoneNumber);
    // todo add PHONE_CODE_EXPIRED error
    return (
      insertCode != null
      &&
      insertCode.code === code
      &&
      insertCode.phoneHash === phoneHash
    );
  }

  async deleteCode(phoneNumber) {
    return this.ctx.model.SendCode.deleteOne({ phoneNumber });
  }
}

module.exports = SendCodeService;
