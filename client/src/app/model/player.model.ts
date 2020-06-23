import { Game } from './game.model';

export interface Score {
    name: string;
    roomId: string;
    score: number;
    date: string;
}

export class Player {
    id: string;
    name: string;
    roomId: string;
    game: Game;
    isDeleted = false;
    scores: { score: number, date: string }[] = [];

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
        this.game = new Game();
    }
}
