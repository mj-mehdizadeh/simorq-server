'use strict';

const Controller = require('../../core/controller');

class WallpaperController extends Controller {

  async handle() {
    const { skip, limit } = this.ctx.query;
    return this.ctx.service.wallpaper.findWallpaper(skip || 0, limit || 40);
  }
}

module.exports = WallpaperController;
