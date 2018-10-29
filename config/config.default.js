'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539412428674_1355';

  // add your config here
  config.middleware = [];

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
  config.oauth = {
    accessTokenExpiresTime: 600000,
    refreshTokenExpiresTime: 7776000000,
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

  return config;
};

