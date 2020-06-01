import { Component, OnInit, HostListener } from '@angular/core';
import { TetrisGrid } from 'src/app/model/tetrisGrid.model';
import { TetroMino } from 'src/app/model/tetromino.model';
import * as utils from '../../utils';

@Component({
  selector: 'app-tetris-grid',
  templateUrl: './tetris-grid.component.html',
  styleUrls: ['./tetris-grid.component.scss']
})
export class TetrisGridComponent implements OnInit {

  tetrominoList: TetroMino[];
  tGrid: TetrisGrid;
  current: TetroMino;

  ghost = 80;
  watermark = 90;

  constructor() {
    this.tetrominoList = [];
    this.tGrid = new TetrisGrid(10, 20);
    let i = 0;
    while (i < 4) {
      const tetro = new TetroMino();
      this.tetrominoList.push(tetro);
      i++;
    }

    this.tGrid.grid[19][5] = 3;
    this.current = this.tetrominoList[0];
    this.setSize();
    this.draw();
  }



  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event.keyCode);
    this.setSize();
    if (event.keyCode === 37) { utils.stopAll(event); this.move('left'); } // left
    if (event.keyCode === 38) { utils.stopAll(event); this.move('up'); } // up
    if (event.keyCode === 39) { utils.stopAll(event); this.move('right'); } // right
    if (event.keyCode === 40) { utils.stopAll(event); this.move('down'); } // down
    if (event.keyCode === 32) { utils.stopAll(event); this.move('downMax'); } // space
  }

  move(where: string) {
    this.reset();
    switch (where) {
      case 'up':
        this.rotate();
        break;
      case 'left':
        if (this.current.position.x > 0
          && this.isValidPlace(this.current.position.x - 1, this.current.position.y)) { this.current.position.x--; }
        break;
      case 'right':
        if (this.current.position.x < this.tGrid.cols - this.current.size.width
          && this.isValidPlace(this.current.position.x + 1, this.current.position.y)) { this.current.position.x++; }
        break;
      case 'down':
        if (this.current.position.y < this.tGrid.rows - this.current.size.height
          && this.isValidPlace(this.current.position.x, this.current.position.y + 1)) { this.current.position.y++; }
        break;
      case 'downMax':
        this.current.position.y = this.current.position.ymax;
        break;
      default:
        return;
    }
    this.draw();
  }

  rotate() {

  }

  reset() {
    // tetromino
    for (let indexY = 0; indexY < this.current.size.height; indexY++) {
      for (let indexX = 0; indexX < this.current.size.width; indexX++) {
        if (this.tGrid.grid[this.current.position.y + indexY]
          && this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] !== 0
          && this.tGrid.grid[this.current.position.y + indexY][this.current.position.x + indexX]
          === this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] + this.watermark) {
          this.tGrid.grid[this.current.position.y + indexY][this.current.position.x + indexX] = 0;
        }
      }
    }
    // ghost
    for (let indexY = 0; indexY < this.current.size.height; indexY++) {
      for (let indexX = 0; indexX < this.current.size.width; indexX++) {
        if (this.tGrid.grid[this.current.position.ymax + indexY]
          && this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] !== 0
          && this.tGrid.grid[this.current.position.ymax + indexY][this.current.position.x + indexX]
          === this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] + this.ghost) {
          this.tGrid.grid[this.current.position.ymax + indexY][this.current.position.x + indexX] = 0;
        }
      }
    }
  }

  draw() {
    // tetromino
    for (let indexY = 0; indexY < this.current.size.height; indexY++) {
      for (let indexX = 0; indexX < this.current.size.width; indexX++) {
        if (this.tGrid.grid[this.current.position.y + indexY]
          && this.tGrid.grid[this.current.position.y + indexY][this.current.position.x + indexX] === 0
          && this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] !== 0) {
          this.tGrid.grid[this.current.position.y + indexY][this.current.position.x + indexX]
            = this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] + this.watermark;
        }
      }
    }
    // ghost
    this.current.position.ymax = 0;
    while (this.isValidPlace(this.current.position.x, this.current.position.ymax + 1)) {
      this.current.position.ymax++;
    }
    for (let indexY = 0; indexY < this.current.size.height; indexY++) {
      for (let indexX = 0; indexX < this.current.size.width; indexX++) {
        if (this.tGrid.grid[this.current.position.ymax + indexY]
          && this.tGrid.grid[this.current.position.ymax + indexY][this.current.position.x + indexX] === 0
          && this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] !== 0) {
          this.tGrid.grid[this.current.position.ymax + indexY][this.current.position.x + indexX]
            = this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] + this.ghost;
        }
      }
    }
    console.log(this.tGrid);
  }

  isValidPlace(x: number, y: number): boolean {
    if (this.tGrid.grid[y + this.current.size.height - 1] === undefined
      || this.tGrid.grid[y + this.current.size.height - 1][x + this.current.size.width - 1] === undefined) {
      return false;
    }
    for (let indexY = 0; indexY < this.current.size.height; indexY++) {
      for (let indexX = 0; indexX < this.current.size.width; indexX++) {


        if (this.tGrid.grid[y + indexY]
          && this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] !== 0
          && this.tGrid.grid[y + indexY][x + indexX] !== 0
          && this.tGrid.grid[y + indexY][x + indexX]
          !== this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] + this.ghost
          && this.tGrid.grid[y + indexY][x + indexX]
          !== this.current.shape[this.current.start.y + indexY][this.current.start.x + indexX] + this.watermark) {
          return false;
        }

      }
    }
    return true;
  }

  setSize() {
    this.current.size = { height: 0, width: 0 };
    for (let index = 0; index < this.current.matrix; index++) {
      let activeRowH = false;
      let activeRowW = false;
      for (let i = 0; i < this.current.matrix; i++) {
        if (this.current.shape[i][index] !== 0) {
          activeRowW = true;
          if (this.current.size.width === 0) {
            this.current.start.x = index;
          }
        }
      }
      if (this.current.shape[index].every((cube) => cube === 0) === false) {
        activeRowH = true;
      }
      if (activeRowH) {
        if (this.current.size.height === 0) {
          this.current.start.y = index;
        }
        this.current.size.height++;
      }
      if (activeRowW) { this.current.size.width++; }
    }
    console.log(this.current);
  }

  returnColor(tetroNum: number): string {
    let color = '';
    if (tetroNum - this.watermark > 0) {
      tetroNum = tetroNum - this.watermark;
    } else if (tetroNum - this.ghost > 0) {
      color = color.concat('ghost ');
      tetroNum = tetroNum - this.ghost;
    }
    color = color.concat('type' + tetroNum);
    return color;
  }


  ngOnInit(): void {
  }

}
