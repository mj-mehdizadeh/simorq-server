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
      this.ctx.throwError(e.code, e.errors || e.params || e.data);
    }
  }

  async handle() {
    // handle code
  }

  async emitter() {
    // emit event to other clients
  }

  getInput(key) {
    return this.ctx.request.body[key];
  }

  throwInvalidError(code, params = null) {
    this.ctx.throwError(code, params);
  }
}

module.exports = Controller;
