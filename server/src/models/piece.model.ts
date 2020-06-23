import { TetroMino } from './tetromino.model';

export class Piece {
    id: string;
    masterId: string;
    masterName: string;
    playersId: string[];
    isPlaying: boolean = false;
    pause: boolean = false;
    tetrominoList: TetroMino[] = [];
    mode: number;
    isDeleted: boolean = false;
    constructor(roomId: string, mode: number) {
        this.mode = mode;
        this.id = roomId;
    }
}
