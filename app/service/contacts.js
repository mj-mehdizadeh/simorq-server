'use strict';

const Service = require('egg').Service;

class ContactsService extends Service {

  findContacts(createdBy, offset, limit) {
    return this.ctx.model.Contact.find({ createdBy })
      .skip(offset)
      .limit(limit);
  }

  insertContacts(contacts) {
    return this.ctx.model.Contact.insertMany(contacts);
  }

  updateRoomId(phoneNumber, roomId) {
    return this.ctx.model.Contact.updateMany({ phoneNumber }, { roomId });
  }

  constructModel(params) {
    return new this.ctx.model.Contact(params);
  }
}

module.exports = ContactsService;
