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
  current: TetroMino;
  isWashing = false;
  constructor(readonly roomService: RoomService,
              readonly tetrisService: TetrisService,
              private readonly socket: Socket,
              private readonly toastService: ToastService) {
    this.socket.on('updateTetris', this.updateTetris.bind(this));
  }

  updateTetris(data) {
    if (data && data.room && data.room.id && this.roomService.currentRoom && data.room.id === this.roomService.currentRoom.id) {
      if (data.action === 'play') {
        this.roomService.currentPlayer.isPlaying = true;
        this.toastService.createMessage('success', 'Party start !');
        if (data.tetrominoList) {
          data.tetrominoList.forEach(tetro => {
            this.roomService.currentPlayer.tetrominoList.push(tetro);
          });
          this.current = this.roomService.currentPlayer.tetrominoList[0];
          if (this.roomService.currentPlayer && this.roomService.currentPlayer.tetrominoList &&
            this.current && this.tetrisService.isValidPlace(
              this.current.shape,
              this.current.sign,
              this.roomService.currentPlayer.grid,
              this.current.position.x, this.current.position.y)) {
            this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
          }
          this.timerInterval();
        }
      }
      if (data.action === 'pause') {
        this.toastService.createMessage('success', 'Party pause !');
        window.clearInterval(this.timerEvent);
      }
      if (data.action === 'newTetro') {
        if (data.tetrominoList) {
          data.tetrominoList.forEach(tetro => {
            this.roomService.currentPlayer.tetrominoList.push(tetro);
          });
        }
      }
      if (data.action === 'resume') {
        this.toastService.createMessage('success', 'Party resume !');
        this.timerInterval();
      }
    }
  }

  timerInterval() {
    this.timerEvent = window.setInterval((async () => {
      if (this.roomService.currentPlayer
        && this.roomService.currentPlayer.tetrominoList
        && this.roomService.currentPlayer.tetrominoList.length <= 7) {
        this.socket.emit('newTetro', this.roomService.currentRoom);
      }
      if (this.isWashing) {
        return;
      }
      if (this.current.position.y === this.current.position.ymax) {
        this.current.lock = true;
      } else if (this.current.position.y !== this.current.position.ymax) {
        this.current.lock = false;
        this.move('down');
      }
      if (this.current.lock) {
        if (this.current.position.y === this.current.position.ymax) {
          this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
          this.roomService.currentPlayer.tetrominoList.splice(0, 1);
          this.current = this.roomService.currentPlayer.tetrominoList[0];
          await this.wash();
          if (this.tetrisService.isValidPlace(
            this.current.shape,
            this.current.sign,
            this.roomService.currentPlayer.grid,
            this.current.position.x, this.current.position.y)) {
            this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
          } else {
            this.roomService.currentPlayer.isPlaying = false;
          }
        } else {
          this.current.lock = false;
        }
      }
    }), 650);
  }



  async wash() {
    window.clearInterval(this.timerEvent);
    if (!this.roomService.currentPlayer.grid.shape.every(row => {
      return row.every(cube => cube !== 0) === false;
    })) {
      this.isWashing = true;
      await this.roomService.currentPlayer.grid.shape.forEach(async (row, rowIndex) => {
        if (row.every(cube => cube !== 0)) {
          console.log(row);
          for (let index = 0; index < this.roomService.currentPlayer.grid.shape[rowIndex].length; index++) {
            this.roomService.currentPlayer.grid.shape[rowIndex][index] += this.tetrisService.destroy;
          }
          await utils.sleep(650);
          await this.roomService.currentPlayer.grid.shape.splice(rowIndex, 1);
          await this.roomService.currentPlayer.grid.shape.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
      });
    }
    this.isWashing = false;
    this.timerInterval();
    return;
  }

  ngOnDestroy() {
    window.clearInterval(this.timerEvent);
    this.socket.removeAllListeners('updateTetris');
  }

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
    if (!this.current || !this.roomService.currentRoom.isPlaying || this.roomService.currentRoom.pause || this.isWashing) {
      return;
    }
    switch (where) {
      case 'up':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.tetrisService.rotate(this.current),
          this.current.sign,
          this.roomService.currentPlayer.grid,
          this.current.position.x, this.current.position.y)) {
          this.current.shape =
            this.tetrisService.rotate(this.current);
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
        break;
      case 'left':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.roomService.currentPlayer.grid,
          this.current.position.x - 1, this.current.position.y)) {
          this.current.position.x--;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
        break;
      case 'right':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.roomService.currentPlayer.grid,
          this.current.position.x + 1, this.current.position.y)) {
          this.current.position.x++;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
        break;
      case 'down':
        this.tetrisService.erase(this.roomService.currentPlayer.grid, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.roomService.currentPlayer.grid,
          this.current.position.x, this.current.position.y + 1)) {
          this.current.position.y++;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
        break;
      case 'downMax':
        if (this.current.position.y <= this.current.position.ymax) {
          this.tetrisService.erase(this.roomService.currentPlayer.grid, this.current);
          this.current.position.y = this.current.position.ymax;
          this.tetrisService.draw(this.roomService.currentPlayer.grid, this.current);
        }
        break;
      default:
        return;
    }
  }

}
