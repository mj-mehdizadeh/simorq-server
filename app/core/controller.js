'use strict';

const BaseController = require('egg').Controller;
const map = require('lodash').map;
const isArray = require('lodash').isArray;
const isObject = require('lodash').isObject;

class Controller extends BaseController {

  get rules() {
    return {};
  }

  async run() {
    try {
      this.ctx.validate(this.rules, this.ctx.request.body);
      this.ctx.body = this.presentable(await this.handle());
    } catch (e) {
      console.log('e', e);
      this.ctx.throwError(e.code || e.name, e.errors || e.params, e.status);
    }
  }

  async handle() {
    // handle code
  }

  presentable(input) {
    if (isArray(input)) {
      map(input, item => this.presentable(item));
    } else if (isObject(input)) {
      return input.hasOwnProperty('presentable') ? input.presentable() : input;
    }
    return input;
  }

  get accountId() {
    return this.ctx.locals.oauth.token.accountId;
  }

  getInput(key, def) {
    return this.ctx.request.body[key] || def;
  }

  throwInvalidError(name, params = null) {
    this.ctx.throwError(name, params);
  }
}

module.exports = Controller;
