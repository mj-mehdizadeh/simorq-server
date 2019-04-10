'use strict';

const Controller = require('../../core/controller');

class CheckHashController extends Controller {

  async handle() {
    const contactsHash = this.getInput('contactsHash');
    const user = await this.ctx.service.account.findById(this.accountId, { contactsHash: 1 });
    return {
      equal: contactsHash === user.contactsHash,
    };
  }
}

module.exports = CheckHashController;
