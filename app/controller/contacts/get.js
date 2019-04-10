'use strict';

const Controller = require('../../core/controller');
const uniq = require('lodash').uniqBy;
const map = require('lodash').map;

class GetController extends Controller {

  async handle() {
    const { skip, limit } = this.ctx.query;

    // find user contacts
    const contacts = await this.ctx.service.contacts.findContacts(this.accountId, skip || 0, limit || 40);
    if (!contacts.length) {
      this.throwInvalidError('end_of_contacts');
    }

    // find contacts rooms
    const rooms = await this.ctx.service.room.findInIds(uniq(map(contacts, 'roomId')));

    return {
      contacts: map(contacts, contact => contact.presentable()),
      rooms: map(rooms, room => room.presentable()),
    };
  }
}

module.exports = GetController;
