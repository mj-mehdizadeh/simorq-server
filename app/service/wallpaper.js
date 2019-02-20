'use strict';

const Service = require('egg').Service;
const map = require('lodash').map;

class WallpaperService extends Service {
  async findWallpaper(skip, limit) {
    const wallpapers = await this.ctx.model.Wallpaper
      .find({ deleted: false }, null, { skip, limit, sort: { order: 1 } });
    return this.ctx.service.files.findByTokens(map(wallpapers, 'token'));
  }
}

module.exports = WallpaperService;
