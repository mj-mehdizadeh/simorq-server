'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoomSchema = new Schema({
    username: {type: String, maxlength: 64, index: true},
    title: {type: String, maxlength: 64},
    info: {type: String, maxlength: 254},
    type: {
      type: String,
      enum: ['USER', 'GROUP', 'CHANNEL'],
    },
    presentable: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
    },
    createdBy: {type: mongoose.Types.ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  });

  return mongoose.model('Room', RoomSchema, 'room');
};
