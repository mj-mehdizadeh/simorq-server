'use strict';

const forIn = require('lodash').forIn;

module.exports = {
  throwError(name, params, status = 400) {
    this.throw(status, {
      name,
      params,
    });
  },
  io() {
    const app = this.app;
    return {
      emit(roomId, messageId, message) {
        app.io.to(roomId).emit(messageId, message);
      },
      join(socket, roomId) {
        socket.join(roomId);
      },
      leave(socket, roomId) {
        socket.leave(roomId);
      },
      joinAccount(accountId, roomId) {
        const sockets = app.io.to(accountId).sockets;
        forIn(sockets, socket => this.join(socket, roomId));
      },
      kickAccount(accountId, roomId) {
        const sockets = app.io.to(accountId).sockets;
        forIn(sockets, socket => this.leave(socket, roomId));
      },
    };
  },
};
