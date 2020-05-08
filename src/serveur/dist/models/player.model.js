"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uid = require("uniqid");
class Player {
    constructor(roomId, name) {
        this.roomId = roomId;
        this.name = name;
        this.id = roomId.concat('-', encodeURI(name), '-', uid(), uid());
    }
}
exports.Player = Player;
