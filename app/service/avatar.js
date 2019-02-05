'use strict';

const Service = require('egg').Service;

class AvatarService extends Service {
  async insertAvatar(roomId, token) {
    return this.ctx.model.Avatar.create({ roomId, token });
  }
}

module.exports = AvatarService;
