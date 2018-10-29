'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoomSchema = new Schema({
    username: {type: String, maxlength: 64, index: true},
    title: {type: String, maxlength: 64, required: true},
    info: {type: String, maxlength: 254},
    type: {
      type: String,
      enum: ['USER', 'GROUP', 'CHANNEL'],
      required: true
    },
    presentable: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PRIVATE'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      required: true
    },
    createdBy: {type: Schema.Types.ObjectId, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  });

  return mongoose.model('Room', RoomSchema, 'room');
};
