"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(roomName) {
        this.roomName = roomName;
        this.roomId = encodeURI(roomName);
    }
}
exports.Room = Room;
