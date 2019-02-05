'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoomSchema = new Schema({
    username: { type: String, maxlength: 64, index: true },
    title: { type: String, maxlength: 64, required: true },
    info: { type: String, maxlength: 254 },
    avatar: app.mongoose.model('Files').schema,
    type: {
      type: String,
      enum: [ 'USER', 'GROUP', 'CHANNEL' ],
      required: true,
    },
    availability: {
      type: String,
      enum: [ 'PUBLIC', 'PRIVATE' ],
      default: 'PRIVATE',
    },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  RoomSchema.methods.presentable = function(subscribe = null) {
    return {
      id: this.id,
      username: this.username,
      title: this.title,
      info: this.info,
      type: this.type,
      avatar: this.avatar ? this.avatar.presentable() : null,
      availability: this.availability,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      subscribe: subscribe ? subscribe.presentable() : null,
    };
  };

  return mongoose.model('Room', RoomSchema, 'room');
};
