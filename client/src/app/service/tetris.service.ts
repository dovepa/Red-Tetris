import { Injectable } from '@angular/core';
import { TetroMino } from '../model/tetromino.model';
import { TetrisGrid } from '../model/tetrisGrid.model';

@Injectable({
  providedIn: 'root'
})
export class TetrisService {
  ghost = 80;
  watermark = 90;

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

  lastYValidPlace(shape: number[][], sign: number, grid: TetrisGrid, positionX: number): number {
    let ymax = 0;
    while (this.isValidPlace(shape, sign, grid, positionX, ymax + 1)) {
      ymax++;
    }
    return ymax;
  }

  returnColor(cube: number): string {
    let color = '';
    if (cube - this.watermark > 0) {
      cube = cube - this.watermark;
    } else if (cube - this.ghost > 0) {
      color = color.concat('ghost ');
      cube = cube - this.ghost;
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

  draw(grid: TetrisGrid, tetro: TetroMino, final?: boolean): void {
    tetro.position.ymax = this.lastYValidPlace(tetro.shape, tetro.sign, grid, tetro.position.x);
    // ghost
    if (final === undefined && tetro.position.ymax > tetro.position.y) {
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
          if (final) {
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
}
