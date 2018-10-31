'use strict';

const Service = require('egg').Service;

class RoomService extends Service {

  findById(id) {
    return this.ctx.model.Room.findById(id);
  }

  findByUsername(username) {
    return this.ctx.model.Room.findOne({ username });
  }

  findChat(createdBy) {
    return this.ctx.model.Room.findOne({ createdBy, type: 'USER' });
  }

  insertRoom(title, info, type, createdBy) {
    return this.ctx.model.Room.create({ title, info, type, createdBy });
  }

  editRoom(id, params) {
    return this.ctx.model.Room.updateOne({ _id: id }, params);
  }
}

module.exports = RoomService;
