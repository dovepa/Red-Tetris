import { Component, OnInit, HostListener, AfterViewChecked, OnDestroy } from '@angular/core';
import { TetroMino } from 'src/app/model/tetromino.model';
import * as utils from '../../utils';
import { TetrisService } from 'src/app/service/tetris.service';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
@Component({
  selector: 'app-tetris-grid',
  templateUrl: './tetris-grid.component.html',
  styleUrls: ['./tetris-grid.component.scss']
})
export class TetrisGridComponent implements OnInit, OnDestroy {

  timerEvent: number | undefined;
  current: TetroMino;
  isWashing = false;
  malusgrid = 0;

  constructor(readonly roomService: RoomService,
    readonly tetrisService: TetrisService,
    private readonly socket: Socket,
    private readonly toastService: ToastService) {
    this.socket.on('updateTetris', this.updateTetris.bind(this));
    this.socket.on('addUndestroyRow', async (data) => {
      if (data && data.room && data.player) {
        if (data.player.id !== this.roomService.currentPlayer.id
          && data.room.id === this.roomService.currentRoom.id
          && this.roomService.currentPlayer.game.endGame === false
          && this.roomService.currentPlayer.game.isPlaying === true) {
          this.malusgrid++;
        }
      }
    });
  }

  updateTetris(data) {
    if (data && data.room && data.room.id && this.roomService.currentRoom && data.room.id === this.roomService.currentRoom.id) {
      if (data.action === 'play') {
        this.roomService.currentPlayer.game.isPlaying = true;
        this.toastService.createMessage('success', 'Party start !');
        if (data.tetrominoList) {
          // faire une vrai copie
          this.current = this.roomService.currentRoom.tetrominoList[this.roomService.currentPlayer.game.tetroCounter];
          if (this.roomService.currentPlayer && this.current && this.tetrisService.isValidPlace(
            this.current.shape,
            this.current.sign,
            this.roomService.currentPlayer.game,
            this.current.position.x, this.current.position.y)) {
            this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
          }
          this.timerInterval();
        }
      }
      if (data.action === 'pause') {
        this.toastService.createMessage('success', 'Party pause !');
        window.clearInterval(this.timerEvent);
      }
      if (data.action === 'resume') {
        this.toastService.createMessage('success', 'Party resume !');
        this.timerInterval();
      }
      if (data.action === 'reset') {
        this.current = undefined;
        this.isWashing = false;
      }
      if (data.action === 'newTetro') {
        if (data.tetrominoList) {
          data.tetrominoList.forEach(tetro => {
            this.roomService.currentRoom.tetrominoList.push(tetro);
          });
        }
      }
    }
  }

  timerInterval() {
    this.timerEvent = window.setInterval((async () => {
      if (this.roomService.currentPlayer
        && this.roomService.currentRoom.tetrominoList
        && (this.roomService.currentRoom.tetrominoList.length - this.roomService.currentPlayer.game.tetroCounter) <= 7) {
        this.socket.emit('newTetro', this.roomService.currentRoom);
      }
      if (this.isWashing || !this.roomService.currentRoom || this.roomService.currentRoom.isPlaying === false || !this.current) {
        return;
      }
      if (this.current.position.y === this.current.position.ymax) {
        this.current.lock = true;
      } else if (this.current.position.y !== this.current.position.ymax) {
        this.current.lock = false;
        this.createMalusLines()
        this.move('down');
      }
      if (this.current.lock) {
        if (this.current.position.y === this.current.position.ymax) {
          this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
          this.roomService.currentPlayer.game.tetroCounter++;
          this.current = this.roomService.currentRoom.tetrominoList[this.roomService.currentPlayer.game.tetroCounter];
          await this.wash();
          if (!this.roomService.currentPlayer.game.shape[2].every(cube => cube === 0 || cube > this.tetrisService.ghost)) {
            this.endGame();
          }
          else if (this.tetrisService.isValidPlace(
            this.current.shape,
            this.current.sign,
            this.roomService.currentPlayer.game,
            this.current.position.x, this.current.position.y)) {
            this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
            this.socket.emit('updatePlayerServer', { player: this.roomService.currentPlayer, room: this.roomService.currentRoom });
          } else {
            this.endGame();
          }
        } else {
          this.current.lock = false;
          this.createMalusLines()
        }
      }
    }), 650);
  }

  endGame() {
    window.clearInterval(this.timerEvent);

    this.roomService.currentPlayer.game.isWinner = this.roomService.currentPlayerList
      .every(p => {
        if (p.id !== this.roomService.currentPlayer.id) {
          return (p.game.isPlaying === false && p.game.endGame === true);
        }
        else {
          return true;
        }
      });

    this.roomService.currentPlayer.game.isPlaying = false;
    this.roomService.currentPlayer.game.endGame = true;
    this.roomService.currentPlayer.game.date = Date.now();
    this.roomService.currentPlayer.scores.push({ score: this.roomService.currentPlayer.game.score, date: moment().format('LLL') });

    if (this.roomService.currentPlayer.game.isWinner) {
      this.roomService.currentRoom.isPlaying = false;
      this.roomService.editRoomAdmin();
    }
    this.socket.emit('updatePlayerServer', { player: this.roomService.currentPlayer, room: this.roomService.currentRoom });
  }


  async wash() {
    window.clearInterval(this.timerEvent);
    if (!this.roomService.currentPlayer.game.shape.every(row => {
      return row.every(cube => (cube !== 0)) === false;
    })) {
      this.isWashing = true;
      let lines = 0;
      await this.roomService.currentPlayer.game.shape.forEach(async (row, rowIndex) => {
        if (row.every(cube => (cube !== 0))) {
          let malus = false;
          if (row.every(cube => (cube !== 119))) {
            malus = true
            lines++;
          }
          for (let index = 0; index < this.roomService.currentPlayer.game.shape[rowIndex].length; index++) {
            this.roomService.currentPlayer.game.shape[rowIndex][index] += this.tetrisService.destroy;
          }
          await utils.sleep(650);
          await this.roomService.currentPlayer.game.shape.splice(rowIndex, 1);
          if (malus)
            this.socket.emit('newUndestryRow',
              { player: this.roomService.currentPlayer, room: this.roomService.currentRoom });
          await this.roomService.currentPlayer.game.shape.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
      });
      this.roomService.currentPlayer.game.score += this.tetrisService.scoring(lines);
    }
    this.tetrisService.createSpectrum(this.roomService.currentPlayer);
    this.createMalusLines()
    this.socket.emit('updatePlayerServer', { player: this.roomService.currentPlayer, room: this.roomService.currentRoom });
    this.isWashing = false;
    this.timerInterval();
    return;
  }

  createMalusLines() {
    // for musti mode 
    while (this.malusgrid > 0) {
      this.roomService.currentPlayer.game.shape.splice(0, 1);
      let line = []
      while (line.length < 10) {
        line.push(this.tetrisService.unDestroy)
      }
      line[utils.getRandomInt(10)] = 0
      this.roomService.currentPlayer.game.shape.push(line);
      this.malusgrid--;
    }
  }

  ngOnDestroy() {
    window.clearInterval(this.timerEvent);
    this.socket.removeAllListeners('addUndestroyRow');
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
    if (!this.current || this.roomService.currentRoom.isPlaying !== true || this.roomService.currentRoom.pause || this.isWashing) {
      return;
    }
    switch (where) {
      case 'up':
        this.tetrisService.erase(this.roomService.currentPlayer.game, this.current);
        if (this.tetrisService.isValidPlace(
          this.tetrisService.rotate(this.current),
          this.current.sign,
          this.roomService.currentPlayer.game,
          this.current.position.x, this.current.position.y)) {
          this.current.shape =
            this.tetrisService.rotate(this.current);
        }
        this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
        break;
      case 'left':
        this.tetrisService.erase(this.roomService.currentPlayer.game, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.roomService.currentPlayer.game,
          this.current.position.x - 1, this.current.position.y)) {
          this.current.position.x--;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
        break;
      case 'right':
        this.tetrisService.erase(this.roomService.currentPlayer.game, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.roomService.currentPlayer.game,
          this.current.position.x + 1, this.current.position.y)) {
          this.current.position.x++;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
        break;
      case 'down':
        this.tetrisService.erase(this.roomService.currentPlayer.game, this.current);
        if (this.tetrisService.isValidPlace(
          this.current.shape,
          this.current.sign,
          this.roomService.currentPlayer.game,
          this.current.position.x, this.current.position.y + 1)) {
          this.current.position.y++;
        }
        this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
        break;
      case 'downMax':
        if (this.current.position.y <= this.current.position.ymax
          && this.tetrisService.isValidPlace(
            this.current.shape,
            this.current.sign,
            this.roomService.currentPlayer.game,
            this.current.position.x, this.current.position.ymax)) {
          this.tetrisService.erase(this.roomService.currentPlayer.game, this.current);
          this.current.position.y = this.current.position.ymax;
          this.tetrisService.draw(this.roomService.currentPlayer.game, this.current);
        }
        break;
      default:
        return;
    }
  }

}
