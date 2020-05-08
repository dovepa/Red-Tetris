import * as utils from '../utils';

export class TetroMino {
    shape: number[][];
    color: string;
    letter: string;
    x: number;
    y: number;
    turn: number;

    constructor() {
        const tetrominoList: [string, string, number[][]][] = [
            ['Cyan', 'I', [[1, 1, 1, 1]]],
            ['Yellow', 'O', [[2, 2], [2, 2]]],
            ['Purple', 'T', [[3, 3, 3], [0, 3, 0]]],
            ['Green', 'S', [[0, 4, 4], [4, 0, 0]]],
            ['Red', 'Z', [[5, 5, 0], [0, 5, 5]]],
            ['Blue', 'J', [[6, 0, 0], [6, 6, 6]]],
            ['Orange', 'L', [[0, 0, 7], [7, 7, 7]]],
        ];
        this.x = 0;
        this.y = 0;
        this.turn = utils.getRandomInt(4);
        const randomTetro = utils.getRandomInt(7);
        this.color = tetrominoList[randomTetro][0];
        this.letter = tetrominoList[randomTetro][1];
        this.shape = tetrominoList[randomTetro][2];
        utils.log(this.shape);
    }
}
