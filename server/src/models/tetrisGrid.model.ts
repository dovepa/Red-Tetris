import { Player } from './player.model';

export class TetrisGrid {
    shape: number[][];
    cols: number;
    rows: number;

    constructor(cols: number, rows: number) {
        this.rows = rows;
        this.cols = cols;
        this.shape = [];
        while (rows) {
            const line: number[] = new Array(cols).fill(0);
            this.shape.push(line);
            rows--;
        }
    }
}

