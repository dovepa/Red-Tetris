import * as utils from '../utils';

export class TetroMino {
    shape: number[][];
    sign: number;
    position: { x: number, y: number, ymax: number };
    readonly matrix: number;

    constructor() {
        const tetrominoList: number[][][] = [
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[7, 0, 0], [7, 7, 7], [0, 0, 0]],
            [[0, 0, 6], [6, 6, 6], [0, 0, 0]],
            [[2, 2], [2, 2]],
            [[0, 4, 4], [4, 4, 0], [0, 0, 0]],
            [[0, 3, 0], [3, 3, 3], [0, 0, 0]],
            [[5, 5, 0], [0, 5, 5], [0, 0, 0]],
        ];
        const randomTetro = utils.getRandomInt(tetrominoList.length);
        this.shape = tetrominoList[randomTetro];
        this.shape.forEach((row) => {
            row.forEach((cube) => {
                if (this.sign === undefined && cube !== 0) { this.sign = cube; }
            });
        });
        this.matrix = this.shape.length;
        this.position = { x: 3, y: 0, ymax: 0 };
    }

    move(where: string) {
        switch (where) {
            case 'left':
                this.position.x--;
                break;
            case 'right':
                this.position.x++;
                break;
            case 'down':
                this.position.y++;
                break;
            case 'downMax':
                this.position.y = this.position.ymax;
                break;
            default:
                break;
        }
    }
}
