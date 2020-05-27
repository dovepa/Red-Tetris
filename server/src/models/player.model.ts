import { TetrisGrid } from './tetrisGrid.model';

export class Player {
    grid: TetrisGrid;
    roomId: string;
    name: string;
    id: string;
    alive: boolean;
    isPlaying: boolean;
    player: boolean;
    watcher: boolean;
    score: number;
    lastPing: Date;

    constructor(roomId: string, name: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = roomId.concat('-', encodeURI(name));
    }
}
