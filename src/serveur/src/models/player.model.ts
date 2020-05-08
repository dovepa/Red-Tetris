import * as uid from 'uniqid';

export class Player {
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
        this.id = roomId.concat('-', encodeURI(name), '-', uid(), uid());
    }
}
