import { Player } from './player.model';
import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export class Room {
    id: string;
    isPlaying: boolean;
    pause: boolean;
    mode: number;
    tetrominoList: TetroMino[];
    playersId: string[];
    masterId: string;
    masterName: string;
    constructor(roomId: string, mode: number) {
        this.mode = mode;
        this.id = roomId;
    }
}
