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

  // mongoose config
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/messenger',
      options: {},
    },
  };

  return config;
};

exports.io = {
  namespace: {
    '/': {
      connectionMiddleware: [ 'connection' ],
      packetMiddleware: [ 'packet' ],
    },
  },
};
