'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async index() {
    const {ctx, app} = this;
    const message = ctx.args[0];
    console.log('onMessage', message);
    await ctx.socket.emit('res', `Hi! I've got your message: $ {message}`);
  }
}

module.exports = DefaultController;
