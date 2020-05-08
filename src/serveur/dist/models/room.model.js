"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uid = require("uniqid");
class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.roomId = encodeURI(roomName).concat(uid());
    }
}
exports.Room = Room;
