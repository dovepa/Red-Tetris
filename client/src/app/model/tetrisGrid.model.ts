import { Player } from './player.model';

export class TetrisGrid {
    grid: number[][];
    players: Player[];
    cols: number;
    rows: number;

    constructor(cols: number, rows: number) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        while (rows) {
            const line: number[] = new Array(cols).fill(0);
            this.grid.push(line);
            rows--;
        }
    }
}
