'use strict';

const forIn = require('lodash').forIn;
const indexOf = require('lodash').indexOf;

module.exports = new Proxy({}, {
  get(target, name) {
    if (indexOf([ 'account', 'room', 'chat' ], name) === -1) {
      throw new RangeError(`The ${name} seems invalid`);
    }
    return {
      emit(roomId, messageId, message) {
        this.app.io.to(`${name} ${roomId}`).emit(messageId, message);
      },
      join(socket, roomId) {
        socket.join(`${name} ${roomId}`);
      },
      leave(socket, roomId) {
        socket.leave(`${name} ${roomId}`);
      },
      joinAccount(accountId, roomId) {
        const sockets = this.app.io.to(`account ${accountId}`).sockets;
        forIn(sockets, socket => this[name].join(socket, roomId));
      },
      kickAccount(accountId, roomId) {
        const sockets = this.app.io.to(`account ${accountId}`).sockets;
        forIn(sockets, socket => this[name].leave(socket, roomId));
      },
    };
  },
});
