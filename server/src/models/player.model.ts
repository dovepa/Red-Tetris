import { TetrisGrid } from './tetrisGrid.model';

export class Player {
    id: string;
    name: string;
    roomName: string;
    grid: TetrisGrid;
    alive: boolean;
    isPlaying: boolean;
    approval: boolean;
    score: number;
    partWin: number;

    constructor(roomName: string, name: string, socketId: string) {
        this.roomName = roomName;
        this.name = name;
        this.id = socketId;
    }
}