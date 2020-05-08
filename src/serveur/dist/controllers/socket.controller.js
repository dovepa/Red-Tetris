"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../utils");
const socketController = (io) => {
    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);
        socket.on('newMessage', data => {
            utils.log('newMessage', data);
            socket.emit('newMessage', data);
        });
        socket.on('userKnockRoomDoor', data => {
            utils.log('userKnockRoomDoor', data);
            socket.emit('userEnter', data);
        });
        socket.on('userLeaveRoom', data => {
            utils.log('userLeaveRoom', data);
            socket.emit('userLeave', data);
        });
        socket.on('userMove', data => {
            utils.log('userMove', data);
            socket.emit('userMoveTetris', data);
        });
        socket.on('disconnect', reason => {
            socket.emit('userDisconnect', socket.id);
            utils.log(`${socket.id} disconnected because: ${reason}`);
        });
    });
};
exports.default = socketController;
