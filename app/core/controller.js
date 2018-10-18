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
}

module.exports = Controller;
