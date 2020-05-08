import { Player } from './player.model';
import { TetrisGrid } from './tetrisGrid.model';
import * as uid from 'uniqid';

export class Room {
    roomName: string;
    roomId: string;
    players: Player[];
    grid: TetrisGrid;
    master: Player;
    constructor(roomName: string) {
        this.roomName = roomName;
        this.roomId = encodeURI(roomName).concat(uid());
    }
}
