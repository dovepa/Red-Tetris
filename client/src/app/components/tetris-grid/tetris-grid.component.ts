import { Component, OnInit, HostListener, AfterViewChecked, OnDestroy } from '@angular/core';
import { TetrisGrid } from 'src/app/model/tetrisGrid.model';
import { TetroMino } from 'src/app/model/tetromino.model';
import * as utils from '../../utils';
import { TetrisService } from 'src/app/service/tetris.service';
import { Room } from 'src/app/model/room.model';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tetris-grid',
  templateUrl: './tetris-grid.component.html',
  styleUrls: ['./tetris-grid.component.scss']
})
export class TetrisGridComponent implements OnInit, OnDestroy {

  timerEvent: number | undefined;

  constructor(readonly roomService: RoomService,
              readonly tetrisService: TetrisService,
              private readonly socket: Socket,
              private readonly toastService: ToastService) {

    this.socket.on('updateTetris', this.updateTetris.bind(this));

    if (this.roomService.currentPlayer && this.roomService.currentPlayer.tetrominoList &&
      this.roomService.currentPlayer.tetrominoList[0]
      && this.tetrisService.isValidPlace(
        this.roomService.currentPlayer.tetrominoList[0].shape,
        this.roomService.currentPlayer.tetrominoList[0].sign,
        this.roomService.currentPlayer.grid,
        this.roomService.currentPlayer.tetrominoList[0].position.x, this.roomService.currentPlayer.tetrominoList[0].position.y)) {
      this.tetrisService.draw(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
    }
  }

  updateTetris(data) {
    if (data && data.room && data.room.id && this.roomService.currentRoom && data.room.id === this.roomService.currentRoom.id) {
      if (data.action === 'play') {
        this.toastService.createMessage('success', 'Party start !');
        this.timerInterval();
      }
      if (data.action === 'pause') {
        this.toastService.createMessage('success', 'Party pause !');
        window.clearInterval(this.timerEvent);
      }
      if (data.action === 'resume') {
        this.toastService.createMessage('success', 'Party resume !');
        this.timerInterval();
      }
    }
  }

  timerInterval() {
    this.timerEvent = window.setInterval((() => {
      this.move('down');
      if (this.roomService.currentPlayer.tetrominoList[0].position.y
        !== this.roomService.currentPlayer.tetrominoList[0].position.ymax) {
        this.roomService.currentPlayer.tetrominoList[0].cicle = false;
      }
      else if (this.roomService.currentPlayer.tetrominoList[0].position.y
        === this.roomService.currentPlayer.tetrominoList[0].position.ymax
        && this.roomService.currentPlayer.tetrominoList[0].cicle === false) {
        this.roomService.currentPlayer.tetrominoList[0].cicle = true;
      }
      else if (this.roomService.currentPlayer.tetrominoList[0].position.y
        === this.roomService.currentPlayer.tetrominoList[0].position.ymax
        && this.roomService.currentPlayer.tetrominoList[0].cicle) {
        this.roomService.currentPlayer.tetrominoList.splice(0, 1);
      }
    }), 1500);
  }

  ngOnDestroy() {
    this.socket.removeAllListeners('updateTetris');
  }

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.roomService.currentRoom.isPlaying || this.roomService.currentRoom.pause) {
      return;
    }
    if (event.keyCode === 37) { utils.stopAll(event); this.move('left'); }
    if (event.keyCode === 38) { utils.stopAll(event); this.move('up'); }
    if (event.keyCode === 39) { utils.stopAll(event); this.move('right'); }
    if (event.keyCode === 40) { utils.stopAll(event); this.move('down'); }
    if (event.keyCode === 32) { utils.stopAll(event); this.move('downMax'); }
  }

  move(where: string) {
    switch (where) {
      case 'up':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        if (this.tetrisService.isValidPlace(
          this.tetrisService.rotate(this.roomService.currentPlayer.tetrominoList[0]),
          this.roomService.currentPlayer.tetrominoList[0].sign,
          this.roomService.currentPlayer.grid,
          this.roomService.currentPlayer.tetrominoList[0].position.x, this.roomService.currentPlayer.tetrominoList[0].position.y)) {
          this.roomService.currentPlayer.tetrominoList[0].shape =
            this.tetrisService.rotate(this.roomService.currentPlayer.tetrominoList[0]);
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        break;
      case 'left':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        if (this.tetrisService.isValidPlace(
          this.roomService.currentPlayer.tetrominoList[0].shape,
          this.roomService.currentPlayer.tetrominoList[0].sign,
          this.roomService.currentPlayer.grid,
          this.roomService.currentPlayer.tetrominoList[0].position.x - 1, this.roomService.currentPlayer.tetrominoList[0].position.y)) {
          this.roomService.currentPlayer.tetrominoList[0].position.x--;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        break;
      case 'right':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        if (this.tetrisService.isValidPlace(
          this.roomService.currentPlayer.tetrominoList[0].shape,
          this.roomService.currentPlayer.tetrominoList[0].sign,
          this.roomService.currentPlayer.grid,
          this.roomService.currentPlayer.tetrominoList[0].position.x + 1, this.roomService.currentPlayer.tetrominoList[0].position.y)) {
          this.roomService.currentPlayer.tetrominoList[0].position.x++;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        break;
      case 'down':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        if (this.tetrisService.isValidPlace(
          this.roomService.currentPlayer.tetrominoList[0].shape,
          this.roomService.currentPlayer.tetrominoList[0].sign,
          this.roomService.currentPlayer.grid,
          this.roomService.currentPlayer.tetrominoList[0].position.x, this.roomService.currentPlayer.tetrominoList[0].position.y + 1)) {
          this.roomService.currentPlayer.tetrominoList[0].position.y++;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
        break;
      case 'downMax':
        if (this.roomService.currentPlayer.tetrominoList[0].position.y <= this.roomService.currentPlayer.tetrominoList[0].position.ymax) {
          this.tetrisService.erase(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0]);
          this.roomService.currentPlayer.tetrominoList[0].position.y = this.roomService.currentPlayer.tetrominoList[0].position.ymax;
          this.tetrisService.draw(this.roomService.currentPlayer.grid, this.roomService.currentPlayer.tetrominoList[0], true);
        }
        break;
      default:
        return;
    }
  }

}
