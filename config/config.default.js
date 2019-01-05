'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539412428674_1355';

  // add security config
  config.security = {
    csrf: {
      enable: false,
    },
    ctoken: {
      enable: false,
    },
  };

  // oauth config
  config.oAuth2Server = {
    debug: config.env === 'local',
    grants: [ 'password', 'refresh_token' ],
    requireClientAuthentication: { password: false },
  };

  // mongoose config
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/messenger',
      options: {},
    },
  };

  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'connection' ],
        packetMiddleware: [ 'packet' ],
      },
    },
  };

  config.jwt = {
    secret: 'drGxqSD1acm2hFg4K7kegQSBBVfgG',
    expiresIn: '15m',
  };

  config.multipart = {
    fileSize: '1000mb',
    whitelist: filename => [ path.extname(filename) || 'png' ],
  };
  config.files = {
    videoFormats: [ '.webm', '.mkv', '.flv', '.vob', '.ogv', '.drc', '.gif', '.gifv', '.mng', '.avi', '.MTS', '.mov', '.wmv', '.yuv', '.rm', '.rmvb', '.asf', '.amv', '.mp4', '.mpg', '.mpg', '.m4v', '.svi', '.3gp', '.3g2', '.mxf', '.roq', '.nsv', '.flv' ],
    imageFormats: [ '.jpg', '.png', '.gif', '.webp', '.tif', '.bmp', '.jxr', '.psd' ],
    localPath: 'uploads',
    thumbs: {
      small: {
        name: 'small.png',
        size: '90x?',
      },
      medium: {
        name: 'medium.png',
        size: '320x?',
      },
      large: {
        name: 'large.png',
        size: '600x?',
      },
    },
  };

  return config;
};

