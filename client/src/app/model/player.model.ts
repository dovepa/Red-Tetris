import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export interface Score {
    name: string;
    roomId: string;
    score: number;
    date: number;
}

export class Player {
    id: string;
    name: string;
    roomId; string;
    grid: TetrisGrid;
    tetrominoList: TetroMino[];
    isPlaying: boolean;
    isDeleted: boolean;
    scores: { score: number, date: number }[];
    score: number;
    partWin: number;

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
    }
}
