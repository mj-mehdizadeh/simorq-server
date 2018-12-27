'use strict';

const Controller = require('../../core/controller');

class CreateController extends Controller {
  get rules() {
    return {
      room_id: { type: 'string' },
      random_id: { type: 'number' },
      type: {
        type: 'enum',
        values: [ 'PHOTO', 'VIDEO', 'VOICE', 'MUSIC', 'FILE', 'GIF', 'CONTACT', 'LOCATION' ],
        required: false,
      },
      forward_from: {
        type: 'object',
        rule: {
          room_id: { type: 'string' },
          message_id: { type: 'string' },
        },
        required: false,
      },
      reply_to: { type: 'string', required: false },
      message: { type: 'string', required: false },
      attachment: { type: 'string', required: false },
      location: { type: 'object', required: false },
      contact: { type: 'object', required: false },
    };
  }

  async handle() {
    const roomId = this.getInput('room_id');
    const message = this.getInput('message');
    const attachment = this.getInput('attachment');
    const location = this.getInput('location');
    const contact = this.getInput('contact');

    if (!message && !attachment && !location && !contact) {
      this.throwInvalidError('content_required');
    }
    return this.ctx.service.message.newMessage(this.accountId, roomId, {
      randomId: this.getInput('random_id'),
      type: this.getInput('type'),
      forwardFrom: this.getInput('forward_from'),
      replyTo: this.getInput('reply_to'),
      message,
      attachment,
      location,
      contact,
    });
  }
}

module.exports = CreateController;
