'use strict';

const Controller = require('../../core/controller');

class GetController extends Controller {
  get rules() {
    return {
      username: { type: 'string', required: false },
    };
  }

  async handle() {
    const { id } = this.ctx.params;
    const { skip, limit } = this.ctx.query;
    const username = this.getInput('username');
    if (id && this.ctx.helper.matchId(id)) {
      return this.ctx.service.room.findById(id);
    }
    if (username && username.length >= 3) {
      return await this.ctx.service.room.findUsername(username, skip, limit);
    }
  }
}

module.exports = GetController;
