import { Component, OnInit, HostListener } from '@angular/core';
import { TetrisGrid } from 'src/app/model/tetrisGrid.model';
import { TetroMino } from 'src/app/model/tetromino.model';
import * as utils from '../../utils';
import { TetrisService } from 'src/app/service/tetris.service';
import { Room } from 'src/app/model/room.model';

@Component({
  selector: 'app-tetris-grid',
  templateUrl: './tetris-grid.component.html',
  styleUrls: ['./tetris-grid.component.scss']
})
export class TetrisGridComponent implements OnInit {

  constructor(readonly tetrisService: TetrisService) {
    this.grid = new TetrisGrid(10, 20);
    this.grid.shape[19][5] = 3;

    let i = 0;
    this.tetrominoList = [];
    while (i < 4) {
      const tetro = new TetroMino();
      if (i === 0) { this.current = tetro; }
      else { this.tetrominoList.push(tetro); }
      i++;
    }
    this.room = new Room('aaa', 0);
    this.room.master = 's';
    this.me = 's';

    if (this.tetrisService.isValidPlace(
      this.current.shape,
      this.current.sign,
      this.grid,
      this.current.position.x, this.current.position.y)) {
      this.tetrisService.draw(this.grid, this.current);
    }
  }

  room;
  me;

  tetrominoList: TetroMino[];
  grid: TetrisGrid;
  current: TetroMino;

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 37) { utils.stopAll(event); this.move('left'); }
    if (event.keyCode === 38) { utils.stopAll(event); this.move('up'); }
    if (event.keyCode === 39) { utils.stopAll(event); this.move('right'); }
    if (event.keyCode === 40) { utils.stopAll(event); this.move('down'); }
    if (event.keyCode === 32) { utils.stopAll(event); this.move('downMax'); }
  }

  move(where: string) {
    switch (where) {
      case 'up':
        this.tetrisService.erase(this.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.tetrisService.rotate(this.current),
          this.current.sign,
          this.grid,
          this.current.position.x, this.current.position.y)) {
          this.current.shape = this.tetrisService.rotate(this.current);
        }
        this.tetrisService.draw(this.grid, this.current);
        break;
      case 'left':
        this.tetrisService.erase(this.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.grid,
          this.current.position.x - 1, this.current.position.y)) {
          this.current.move(where);
        }
        this.tetrisService.draw(this.grid, this.current);
        break;
      case 'right':
        this.tetrisService.erase(this.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.grid,
          this.current.position.x + 1, this.current.position.y)) {
          this.current.move(where);
        }
        this.tetrisService.draw(this.grid, this.current);
        break;
      case 'down':
        this.tetrisService.erase(this.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.grid,
          this.current.position.x, this.current.position.y + 1)) {
          this.current.move(where);
        }
        this.tetrisService.draw(this.grid, this.current);
        break;
      case 'downMax':
        if (this.current.position.y <= this.current.position.ymax) {
          this.tetrisService.erase(this.grid, this.current);
          this.current.position.y = this.current.position.ymax;
          this.tetrisService.draw(this.grid, this.current, true);
        }
        break;
      default:
        return;
    }
  }

}
