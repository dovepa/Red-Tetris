import { TetrisGrid } from './tetrisGrid.model';
import { TetroMino } from './tetromino.model';

export class Player {
    id: string;
    name: string;
    roomId: string;
    grid: TetrisGrid;
    tetrominoList: TetroMino[];
    isDeleted: boolean;
    isPlaying: boolean;
    score: number;
    partWin: number;
    scores: { score: number, date: number }[];

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
    }
}