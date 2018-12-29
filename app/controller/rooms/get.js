'use strict';

const Controller = require('../../core/controller');

class GetController extends Controller {
  get rules() {
    return {
      room_id: { type: 'string', required: false },
      username: { type: 'string', required: false },
      skip: { type: 'number', required: false },
      limit: { type: 'number', required: false },
    };
  }

  async handle() {
    const roomId = this.getInput('room_id');
    const username = this.getInput('username');
    const skip = this.getInput('skip', 0);
    const limit = this.getInput('limit', 20);
    if (roomId) {
      return this.ctx.service.room.findById(roomId);
    }
    if (username && username.length >= 3) {
      return await this.ctx.service.room.findUsername(username, skip, limit);
    }
  }
}

module.exports = GetController;
