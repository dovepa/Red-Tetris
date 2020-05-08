"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(roomId, name) {
        this.roomId = encodeURI(roomId);
        this.name = name;
        this.id = roomId.concat('-', name, '-');
    }
}
exports.Player = Player;
