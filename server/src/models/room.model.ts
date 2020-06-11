import { Player } from './player.model';
import { TetroMino } from './tetromino.model';

export class Room {
    roomName: string;
    id: string;
    isPlaying: boolean;
    mode: number;
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
