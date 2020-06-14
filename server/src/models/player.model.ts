import { TetrisGrid } from './tetrisGrid.model';

export class Player {
    id: string;
    name: string;
    roomId: string;
    grid: TetrisGrid;
    alive: boolean;
    isPlaying: boolean;
    approval: boolean;
    score: number;
    partWin: number;

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
    }
}