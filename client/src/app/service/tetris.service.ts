import { Injectable } from '@angular/core';
import { TetroMino } from '../model/tetromino.model';
import { TetrisGrid } from '../model/tetrisGrid.model';
import { Player } from '../model/player.model';

@Injectable({
  providedIn: 'root'
})
export class TetrisService {
  ghost = 80;
  watermark = 90;
  destroy = 120;

  constructor() { }

  isValidPlace(shape: number[][], sign: number, grid: TetrisGrid, positionX: number, positionY: number): boolean {
    return shape.every((row, countY) => {
      return row.every((cube, countX) => {
        const curentX = positionX + countX;
        const curentY = positionY + countY;
        return (cube === 0
          || (grid.shape[curentY] && grid.shape[curentY][curentX] === 0)
          || (grid.shape[curentY] && grid.shape[curentY][curentX] === sign + this.watermark)
          || (grid.shape[curentY] && grid.shape[curentY][curentX] === sign + this.ghost)
        );
      });
    });
  }

  lastYValidPlace(tetro: TetroMino, grid: TetrisGrid) {
    let ymax = tetro.position.y.valueOf();
    while (this.isValidPlace(tetro.shape, tetro.sign, grid, tetro.position.x, ymax + 1)) {
      ymax++;
    }
    return ymax;
  }

  returnColor(cube: number): string {
    let color = '';
    if (cube > this.destroy) {
      cube = cube - this.destroy;
      color = color.concat('animate__animated animate__bounceOut ');
    } else if (cube - this.watermark > 0) {
      cube = cube - this.watermark;
    } else if (cube - this.ghost > 0) {
      color = color.concat('ghost ');
      cube = cube - this.ghost;
    }
    color = color.concat('type' + cube);
    return color;
  }

  returnColorSpectrum(cube: number): string {
    let color = '';
    if (cube !== 0) {
      cube = 100;
    }
    color = color.concat('type' + cube);
    return color;
  }

  rotate(tetro: TetroMino): number[][] {
    const a: number[][] = [];
    tetro.shape.forEach(rows => {
      const row: number[] = [];
      rows.forEach(cube => { row.push(cube.valueOf()); });
      a.push(row);
    });
    const n = a.length;
    for (let i = 0; i < n / 2; i++) {
      for (let j = i; j < n - i - 1; j++) {
        const tmp = a[i][j];
        a[i][j] = a[n - j - 1][i];
        a[n - j - 1][i] = a[n - i - 1][n - j - 1];
        a[n - i - 1][n - j - 1] = a[j][n - i - 1];
        a[j][n - i - 1] = tmp;
      }
    }
    return a;
  }

  draw(grid: TetrisGrid, tetro: TetroMino): void {
    tetro.position.ymax = this.lastYValidPlace(tetro, grid);
    // ghost
    if (!tetro.lock && tetro.position.ymax > tetro.position.y) {
      grid.shape.forEach((rows, indexY) => {
        rows.forEach((cube, indexX) => {
          if (indexY >= tetro.position.ymax
            && indexY - tetro.position.ymax < tetro.matrix
            && indexX >= tetro.position.x
            && indexX - tetro.position.x < tetro.matrix
            && tetro.shape[indexY - tetro.position.ymax][indexX - tetro.position.x] !== 0) {
            rows[indexX] = tetro.shape[indexY - tetro.position.ymax][indexX - tetro.position.x] + this.ghost;
          }
        });
      });
    }
    // tetri
    grid.shape.forEach((rows, indexY) => {
      rows.forEach((cube, indexX) => {
        if (indexY >= tetro.position.y
          && indexY - tetro.position.y < tetro.matrix
          && indexX >= tetro.position.x
          && indexX - tetro.position.x < tetro.matrix
          && tetro.shape[indexY - tetro.position.y][indexX - tetro.position.x] !== 0) {
          if (tetro.lock) {
            rows[indexX] = tetro.shape[indexY - tetro.position.y][indexX - tetro.position.x];
          }
          else {
            rows[indexX] = tetro.shape[indexY - tetro.position.y][indexX - tetro.position.x] + this.watermark;
          }
        }
      });
    });
  }

  erase(grid: TetrisGrid, tetro: TetroMino) {
    grid.shape.forEach((rows) => {
      rows.forEach((cube, indexX) => {
        if (rows[indexX] === (tetro.sign + this.watermark) || rows[indexX] === (tetro.sign + this.ghost)) {
          rows[indexX] = 0;
        }
      });
    });
  }

  createSpectrum(player: Player) {
    player.grid.shape.forEach((row, indexRow) => {
      row.forEach((cube, indexCube) => {
        if (cube !== 0) {
          player.spectrum[indexRow][indexCube] = 100;
        }
        else {
          player.spectrum[indexRow][indexCube] = 0;
        }
      });
    });

    player.spectrum.forEach((row, indexRow) => {
      row.forEach((cube, indexCube) => {
        if (cube !== 0) {
          player.spectrum.forEach((rowDown, indexRowDown) => {
            if (indexRowDown > indexRow) {
              player.spectrum[indexRowDown][indexCube] = 100;
            }
          });
        }
      });
    });
  }


  scoring(line: number) {
    if (line === 1) {
      return 100;
    }
    else if (line === 2) {
      return 400;
    }
    else if (line === 3) {
      return 900;
    }
    else if (line >= 4) {
      return 2000;
    }
  }

}
