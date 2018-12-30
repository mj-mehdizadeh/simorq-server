'use strict';

const forIn = require('lodash').forIn;

module.exports = (app, name) => ({
  emit(roomId, messageId, message) {
    app.io.to(`${name} ${roomId}`).emit(messageId, message);
  },
  join(socket, roomId) {
    socket.join(`${name} ${roomId}`);
  },
  leave(socket, roomId) {
    socket.leave(`${name} ${roomId}`);
  },
  joinAccount(accountId, roomId) {
    const sockets = app.io.to(`account ${accountId}`).sockets;
    forIn(sockets, socket => this[name].join(socket, roomId));
  },
  kickAccount(accountId, roomId) {
    const sockets = app.io.to(`account ${accountId}`).sockets;
    forIn(sockets, socket => this[name].leave(socket, roomId));
  },
});
