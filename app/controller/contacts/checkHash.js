'use strict';

const Controller = require('../../core/controller');

class CheckHashController extends Controller {

  async handle() {
    const contactsHash = this.getInput('contactsHash');
    const userContactsHash = await this.ctx.service.account.findById(this.accountId, { contactsHash: 1 });
    return contactsHash === userContactsHash ? 0 : 1;
  }
}

module.exports = CheckHashController;
