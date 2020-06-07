import { Player } from './player.model';
import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export class Room {
    roomName: string;
    mode: number;
    roomId: string;
    players: Player[];
    tetrominoList: TetroMino[];
    master: Player;
    constructor(roomName: string, mode: number) {
        this.mode = mode;
        this.roomName = roomName;
        this.roomId = encodeURI(roomName);
    }
}
