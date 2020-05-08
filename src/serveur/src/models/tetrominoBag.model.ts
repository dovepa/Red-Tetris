import { TetroMino } from './tetromino.model';

export class TetroMinoBag {
    tetrominoList: TetroMino[];
    constructor() {
        let i = 7;
        this.tetrominoList = [];
        while (i) {
            this.tetrominoList.push(new TetroMino());
            i--;
        }
    }
}