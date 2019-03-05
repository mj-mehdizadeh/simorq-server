'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;
const find = require('lodash').find;

class ImportController extends Controller {

  async handle() {
    const contacts = this.getInput('contacts');
    const users = await this.ctx.service.account.findInPhoneNumbers(map(contacts, 'phone_number'));
    return this.ctx.service.contact.insertContacts(
      map(
        contacts,
        contact => ({
          roomId: find(users, { phoneNumber: contact.phone_number }),
          title: contact.title,
          phoneNumber: contact.phone_number,
          createdBy: this.accountId,
        })
      )
    );
  }
}

module.exports = ImportController;
