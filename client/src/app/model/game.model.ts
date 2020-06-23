export class Game {
    shape: number[][];
    spectrum: number[][];
    date: number = Date.now();
    tetroCounter = 0;
    score = 0;
    endGame = false;
    isPlaying = false;
    isWinner = false;
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

