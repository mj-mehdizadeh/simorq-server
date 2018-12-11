'use strict';

const Controller = require('../../core/controller');

class CreateController extends Controller {
  get rules() {
    return {
      room_id: { type: 'string', required: false },
      invite_link: { type: 'string', required: false },
    };
  }

  async handle() {
    const roomId = this.getInput('room_id');
    const inviteLink = this.getInput('invite_link');
    const accountId = this.ctx.locals.oauth.token.accountId;

    let room = null;
    if (inviteLink) {
      room = await this.ctx.service.room.findByUsername(inviteLink);
    } else if (roomId) {
      room = await this.ctx.service.room.findById(roomId);
    }

    if (room == null ||
      (room.type !== 'GROUP' && room.type !== 'CHANNEL') ||
      (room.availability === 'PRIVATE' && !inviteLink)) {
      this.throwInvalidError('room_not_found');
    }

    const subscribe = await this.ctx.service.subscription.insertSubscribe(room.id, accountId, 'MEMBER');
    return subscribe.presentable();
  }
}

module.exports = CreateController;