import { Game } from './game.model';

export class Player {
    id: string;
    name: string;
    roomId: string;
    game: Game;
    isDeleted: boolean = false;
    scores: { score: number, date: string }[] = [];

    constructor(roomId: string, name: string, socketId: string) {
        this.roomId = roomId;
        this.name = name;
        this.id = socketId;
        this.game = new Game();
    }
}