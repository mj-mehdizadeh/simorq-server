'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WallpaperSchema = new Schema({
    token: { type: String, maxlength: 64, required: true },
    order: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Wallpaper', WallpaperSchema, 'wallpaper');
};
