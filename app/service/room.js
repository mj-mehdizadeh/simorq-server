'use strict';

const Service = require('egg').Service;
const generateRandomToken = require('../core/security').generateRandomToken;

class RoomService extends Service {

  findById(id) {
    return this.ctx.model.Room.findById(id);
  }

  findByUsername(username) {
    return this.ctx.model.Room.findOne({ username });
  }

  async checkUsername(username, roomId) {
    const room = await this.ctx.model.Room.findOne({ username }).select({ _id: 1 });
    return (room == null || (roomId && room.id === roomId));
  }

  findUserRoom(createdBy) {
    return this.ctx.model.Room.findOne({ createdBy, type: 'USER' });
  }

  findUsername(query, skip, limit) {
    return this.ctx.model.Room.find({
      username: { $regex: '.*' + query + '.*' },
    }).skip(skip).limit(limit);
  }

  async insertRoom(title, info, type, createdBy) {
    return this.ctx.model.Room.create({
      username: type !== 'USER' ? await generateRandomToken() : null,
      title, info, type, createdBy,
    });
  }

  editRoom(id, params) {
    return this.ctx.model.Room.updateOne({ _id: id }, params);
  }
}

module.exports = RoomService;
