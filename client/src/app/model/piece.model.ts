import { TetroMino } from './tetromino.model';

export class Piece {
    id: string;
    masterId: string;
    masterName: string;
    playersId: string[];
    tetrominoList: TetroMino[] = [];
    isPlaying = false;
    pause = false;
    mode: number;
    isDeleted = false;
    constructor(roomId: string, mode: number) {
        this.mode = mode;
        this.id = roomId;
    }
}
