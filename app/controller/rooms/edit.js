'use strict';

const Controller = require('../../core/controller');
const generateRandomToken = require('../../core/security').generateRandomToken;

class EditController extends Controller {
  get rules() {
    return {
      title: { type: 'string', required: false },
      username: { type: 'string', required: false },
      info: { type: 'string', required: false },
      revoke_invite_link: { type: 'boolean', required: false },
    };
  }

  async handle() {
    await this.findRoom();

    if (this.getInput('username')) {
      await this.setUsername();
    }
    if (this.getInput('revoke_invite_link')) {
      await this.revokeInviteLink();
    }
    if (this.getInput('title')) {
      this.room.title = this.getInput('title');
    }
    if (this.getInput('info')) {
      this.room.info = this.getInput('info');
    }

    await this.room.save();

    return this.room;
  }

  async setUsername() {
    const username = this.getInput('username');

    if (this.room.type === 'GROUP') {
      this.throwInvalidError('invalid_room_username');
    }

    const validUsername = await this.ctx.service.room.checkUsername(username, this.room.id);
    if (!validUsername) {
      return this.throwInvalidError('invalid_username');
    }

    this.room.username = username;
    this.room.availability = 'PUBLIC';
  }

  async revokeInviteLink() {
    if (this.room.type === 'USER') {
      this.throwInvalidError('invalid_room_availability');
    }
    this.room.availability = 'PRIVATE';
    this.room.username = await generateRandomToken();
  }

  async findRoom() {
    const roomId = this.ctx.params.id;
    const accountId = this.ctx.locals.oauth.token.accountId;

    this.room = await this.ctx.service.room.findById(roomId);
    if (this.room == null || this.room.createdBy.toString() !== accountId.toString()) {
      this.throwInvalidError('invalid_room');
    }
  }
}

module.exports = EditController;
