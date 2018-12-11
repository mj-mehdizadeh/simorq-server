'use strict';

const BaseController = require('egg').Controller;

class Controller extends BaseController {

  get rules() {
    return {};
  }

  async run() {
    try {
      this.ctx.validate(this.rules, this.ctx.request.body);
      this.ctx.body = await this.handle();
    } catch (e) {
      this.ctx.throwError(e.code || e.name, e.errors || e.params, e.status);
    }
  }

  async handle() {
    // handle code
  }

  get accountId() {
    return this.ctx.locals.oauth.token.accountId;
  }

  getInput(key) {
    return this.ctx.request.body[key];
  }

  throwInvalidError(name, params = null) {
    this.ctx.throwError(name, params);
  }
}

module.exports = Controller;
