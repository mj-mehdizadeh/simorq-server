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
      console.error('e', e);
      this.ctx.type = 'json';
      this.ctx.status = e.status || 400;
      this.ctx.body = {
        name: e.code || e.name,
        params: e.errors || e.params,
      };
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
