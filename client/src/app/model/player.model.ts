import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export interface Score {
    name: string;
    roomId: string;
    score: number;
    date: string;
}

export class Player {
    id: string;
    name: string;
    roomId; string;
    grid: TetrisGrid;
    spectrum: number[][];
    tetrominoList: TetroMino[];
    isPlaying: boolean;
    endGame: boolean;
    isDeleted: boolean;
    scores: { score: number, date: string }[];
    score: number;
    date: number;
    isWinner: boolean;

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
    }
}
