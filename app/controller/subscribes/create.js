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

    let subscribe = await this.ctx.service.subscription.findUserSubscription(room.id, this.accountId);
    if (subscribe === null) {
      subscribe = await this.ctx.service.subscription.insertSubscribe(room.id, this.accountId, 'MEMBER', room.type);
    }
    return subscribe;
  }
}

module.exports = CreateController;
