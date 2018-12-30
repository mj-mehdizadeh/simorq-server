'use strict';

const io = require('./io');

module.exports = {
  throwError(name, params, status = 400) {
    this.throw(status, {
      name,
      params,
    });
  },
  io(name) {
    return io(this.app, name);
  },
};
