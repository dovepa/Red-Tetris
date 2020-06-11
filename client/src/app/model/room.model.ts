import { Player } from './player.model';
import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export class Room {
    roomName: string;
    id: string;
    mode: number;
    isPlaying: boolean;
    tetrominoList: TetroMino[];
    playersId: string[];
    masterId: string;
    masterName: string;
    constructor(roomName: string, mode: number) {
        this.mode = mode;
        this.roomName = roomName;
        this.id = encodeURI(roomName);
    }
}
