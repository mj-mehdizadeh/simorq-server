'use strict';

const Controller = require('../../../core/controller');

class CreateController extends Controller {
  get rules() {
    return {
      token: { type: 'string' },
    };
  }

  async handle() {
    const roomId = this.ctx.params.id;
    const token = this.getInput('token');

    const file = await this.ctx.service.files.findByToken(token);
    if (!file || !file.mimeType.startsWith('image')) {
      this.ctx.throwError('invalid_file');
    }

    const room = await this.ctx.service.room.findById(roomId);
    if (!room) {
      this.ctx.throwError('invalid_room');
    }

    if (room.createdBy.toString() !== this.accountId) {
      if (room.type === 'USER') {
        this.ctx.throwError('unauthorized');
      }
      const subscribe = await this.ctx.service.subscription.findUserSubscription(room.id, this.accountId);
      if (!subscribe || (subscribe.role === 'MEMBER' && room.type === 'CHANNEL')) {
        this.ctx.throwError('unauthorized');
      }
    }

    await this.ctx.service.room.editRoom(room.id, {
      avatar: file,
    });
    await this.ctx.service.avatar.insertAvatar(room.id, file.token);

    return file.presentable();
  }
}

module.exports = CreateController;
