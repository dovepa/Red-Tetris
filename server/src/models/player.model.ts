import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export class Player {
    id: string;
    name: string;
    roomId: string;
    grid: TetrisGrid;
    spectrum: number[][];
    tetrominoList: TetroMino[];
    isDeleted: boolean;
    isPlaying: boolean;
    endGame: boolean;
    score: number;
    date: number;
    isWinner: boolean;
    scores: { score: number, date: string }[];

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
    }
}