'use strict';

const Controller = require('../../core/controller');

class EditController extends Controller {
  get rules() {
    return {
      message_id: { type: 'string' },
      text: { type: 'string', required: false },
      reply_to: { type: 'string', required: false },
    };
  }

  async handle() {

    const message = await this.ctx.service.message.findById(this.getInput('message_id'));
    if (!message) {
      this.throwInvalidError('invalid_message');
    }

    let isOwner = message.createdBy.toString() === this.accountId.toString();
    if (!isOwner && message.refType === 'ROOM') {
      const subscribe = await this.ctx.service.subscription.findUserSubscription(message.refId, this.accountId);
      isOwner = subscribe.role === 'ADMIN' || subscribe.role === 'OWNER';
    }

    if (!isOwner) {
      this.throwInvalidError('invalid_message_access');
    }

    const text = this.getInput('text');
    const replyTo = this.getInput('reply_to');
    message.text = text || message.attachment || message.contact || message.location ? text : message.text;

    if (replyTo) {
      message.replyTo = replyTo;
    }
    message.updatedAt = Date.now();
    await message.save();
    return message.presentable();
  }
}

module.exports = EditController;
