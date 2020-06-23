export class Game {
    shape: number[][];
    spectrum: number[][];
    date: number = Date.now();
    tetroCounter = 0;
    score: number = 0;
    endGame: boolean = false;
    isPlaying: boolean = false;
    isWinner: boolean = false;
    constructor() {
        let rows = 22;
        const cols = 10;
        this.shape = [];
        while (rows) {
            const line: number[] = new Array(cols).fill(0);
            this.shape.push(line);
            rows--;
        }
        this.spectrum = this.shape;
    }
}

