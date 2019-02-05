'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AvatarSchema = new Schema({
    token: { type: String, maxlength: 64, required: true, index: true },
    roomId: { type: Schema.Types.ObjectId, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Avatar', AvatarSchema, 'avatar');
};
