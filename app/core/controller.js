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
      this.ctx.body = e;
      this.ctx.status = e.statusCode;
    }
  }

  async handle() {
    // handle code
  }

  async emitter(result) {
    // emit event to other clients
  }
}

module.exports = Controller;
