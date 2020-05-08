"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TetrisGrid {
    constructor(cols, rows) {
        this.grid = [];
        while (rows) {
            let i = cols;
            const line = [];
            while (i) {
                line.push(0);
                i--;
            }
            this.grid.push(line);
            rows--;
        }
    }
}
exports.TetrisGrid = TetrisGrid;
