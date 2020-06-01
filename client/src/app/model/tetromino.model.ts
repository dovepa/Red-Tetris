import * as utils from '../utils';

export class TetroMino {
    shape: number[][];
    position: { x: number, y: number, ymax: number };
    size: { width: number, height: number };
    start: { x: number, y: number };
    readonly matrix: number;

    constructor() {
        const tetrominoList: number[][][] = [
            // [[2, 2], [2, 2]],
            // [[3, 3, 3], [0, 3, 0], [0, 0, 0]],
            // [[0, 4, 4], [4, 4, 0], [0, 0, 0]],
            // [[5, 5, 0], [0, 5, 5], [0, 0, 0]],
            // [[6, 0, 0], [6, 6, 6], [0, 0, 0]],
            // [[0, 0, 7], [7, 7, 7], [0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            // [[0, 3, 0], [3, 3, 0], [0, 3, 0]],
            [[0, 3, 0], [3, 3, 3], [0, 0, 0]]
        ];
        const randomTetro = utils.getRandomInt(tetrominoList.length);
        this.shape = tetrominoList[randomTetro];
        this.matrix = this.shape.length;
        this.position = { x: 3, y: 0, ymax: 0 };
        this.size = { width: 0, height: 0 };
        this.start = { x: 0, y: 0 };
    }
}
