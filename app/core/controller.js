'use strict';

const BaseController = require('egg').Controller;

class Controller extends BaseController {

  get rules() {
    return {};
  }

  async run() {
    this.ctx.validate(this.rules, this.ctx.socket.id ? this.ctx.args[1] : this.ctx.request.body);
    const result = await this.handle();
    this.emitter(result);
    return result;
  }

  async handle() {
    // handle code
  }

  async emitter() {
    // emit event to other clients
  }

  getInput(key) {
    return this.ctx.socket.id ? this.ctx.args[1][key] : this.ctx.request.body[key];
  }

  throwInvalidError(name, params = null) {
    this.ctx.throwError(name, params);
  }
}

module.exports = Controller;
