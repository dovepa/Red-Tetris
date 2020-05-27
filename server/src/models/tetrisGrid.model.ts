import { Player } from './player.model';

export class TetrisGrid {
    grid: number[][];
    players: Player[];

    constructor(cols: number, rows: number) {
        this.grid = [];
        while (rows) {
            let i = cols;
            const line: number[] = [];
            while (i) {
                line.push(0);
                i--;
            }
            this.grid.push(line);
            rows--;
        }
    }
}
