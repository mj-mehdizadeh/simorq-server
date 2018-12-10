'use strict';

const Controller = require('../../core/controller');
const generateRandomToken = require('../../core/security').generateRandomToken;

class EditController extends Controller {
  get rules() {
    return {
      title: { type: 'string', required: false },
      username: { type: 'string', required: false },
      info: { type: 'string', required: false },
      availability: { type: 'enum', values: [ 'PUBLIC', 'PRIVATE' ], required: false },
    };
  }

  async handle() {
    const roomId = this.ctx.params.id;
    const accountId = this.ctx.locals.oauth.token.accountId;

    const room = await this.ctx.service.room.findById(roomId);
    if (room == null || room.createdBy.toString() !== accountId.toString()) {
      return this.throwInvalidError('invalid_room');
    }

    const username = this.getInput('username');
    if (username) {
      if (!(await this.ctx.service.room.checkUsername(username, roomId))) {
        return this.throwInvalidError('invalid_username');
      }
      room.username = username;
      room.availability = 'PUBLIC';
    } else if (
      room.type !== 'USER' &&
      this.getInput('availability')
    ) {
      room.availability = 'PRIVATE';
      room.username = await generateRandomToken();
    }

    if (this.getInput('title')) {
      room.title = this.getInput('title');
    }
    if (this.getInput('info')) {
      room.info = this.getInput('info');
    }

    await room.save();

    return room.presentable();
  }
}

module.exports = EditController;
