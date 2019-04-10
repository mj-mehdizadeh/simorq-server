'use strict';

const Controller = require('../../core/controller');
const map = require('lodash').map;
const find = require('lodash').find;
const join = require('lodash').join;
const sortedUniq = require('lodash').sortedUniq;
const crypto = require('crypto');

class ImportController extends Controller {

  async handle() {
    const contacts = this.getInput('contacts');
    const phoneNumbers = sortedUniq(map(contacts, 'phone_number').sort());

    const contactsHash = crypto
      .createHash('md5')
      .update(join(phoneNumbers))
      .digest('hex');
    await this.ctx.service.account.editAccount(this.accountId, { contactsHash });

    const users = await this.ctx.service.account.findInPhoneNumbers(phoneNumbers);
    await this.ctx.service.contacts.insertContacts(
      map(
        contacts,
        contact => {
          const user = find(users, { phoneNumber: contact.phone_number });
          return {
            roomId: user ? user.roomId : null,
            title: contact.title,
            phoneNumber: contact.phone_number,
            createdBy: this.accountId,
          };
        }
      )
    ).catch(() => null);
  }
}

module.exports = ImportController;
