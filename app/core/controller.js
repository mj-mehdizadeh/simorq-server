'use strict';

const BaseController = require('egg').Controller;

class Controller extends BaseController {

  get rules() {
    return {};
  }

  async run() {
    try {
      this.ctx.validate(this.rules);
      const result = await this.handle();
      this.emitter(result);
      this.ctx.body = result;
    } catch (e) {
      this.ctx.response.type = 'json';
      throw e;
    }
  }

  async handle() {
    // handle code
  }

  async emitter(result) {
    // emit event to other clients
  }

  getInput(key) {
    return this.ctx.request.body[key];
  }

  throwInvalidError(code, errors = null) {
    this.ctx.throw(422, 'Validation Failed', {
      code,
      errors,
    });
  }
}

module.exports = Controller;
