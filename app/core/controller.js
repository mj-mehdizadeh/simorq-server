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

  presentable(result) {
    if (isArray(result)) {
      map(result, item => this.presentable(item));
    } else if (isObject(result)) {
      return result.hasOwnProperty('presentable') ? result.presentable() : result;
    }
    return result;
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
