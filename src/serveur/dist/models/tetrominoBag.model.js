"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tetromino_model_1 = require("./tetromino.model");
class TetroMinoBag {
    constructor() {
        let i = 7;
        this.tetrominoList = [];
        while (i) {
            this.tetrominoList.push(new tetromino_model_1.TetroMino());
            i--;
        }
    }
}
exports.TetroMinoBag = TetroMinoBag;
