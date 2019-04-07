'use strict';

const BaseController = require('egg').Controller;
const map = require('lodash').map;
const isArray = require('lodash').isArray;
const isObject = require('lodash').isObject;
const isFunction = require('lodash').isFunction;

class Controller extends BaseController {

  get rules() {
    return {};
  }

  async run() {
    try {
      this.validateRequest();
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

  validateRequest() {
    this.ctx.query.skip = this.ctx.query.skip ? parseInt(this.ctx.query.skip) : null;
    this.ctx.query.limit = this.ctx.query.limit ? parseInt(this.ctx.query.limit) : null;
    this.ctx.validate({
      skip: { type: 'number', min: 0, convertType: true, required: false },
      limit: { type: 'number', min: 0, max: 40, convertType: true, required: false },
    }, this.ctx.query);
    this.ctx.validate(this.rules, this.ctx.request.body);
  }

  async handle() {
    // handle code
  }

  presentable(result) {
    if (isArray(result)) {
      return map(result, item => this.presentable(item));
    } else if (isObject(result) && isFunction(result.presentable)) {
      return result.presentable();
    }
    return result;
  }

  get accountId() {
    return this.ctx.locals.oauth.token.accountId.toString();
  }
  get roomId() {
    return this.ctx.locals.oauth.token.roomId.toString();
  }

  getInput(key, def) {
    return this.ctx.request.body[key] || def;
  }

  throwInvalidError(name, params = null) {
    this.ctx.throwError(name, params);
  }
}

module.exports = Controller;
