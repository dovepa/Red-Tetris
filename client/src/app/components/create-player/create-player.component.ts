import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent implements OnInit, OnDestroy {

  playerName = '';
  playerNameStatus: number;
  isPlaying: boolean;
  timerEvent: number | undefined;

  userEmit = false;

  constructor(private readonly roomService: RoomService,
              private readonly toastService: ToastService,
              private readonly router: Router,
              private readonly socket: Socket) {

    this.socket.on('updateRoom', this.updateRoom.bind(this));
  }

  updateRoom(data) {
    if (data && data.room && data.room.id === this.roomService.selectedRoomId) {
      this.verifPlayerName();
    }
  }

  ngOnDestroy() {
    this.roomService.selectedRoomId = undefined;
    this.socket.removeListener('updateRoom', this.updateRoom.bind(this));
  }

  ngOnInit(): void {
  }

  async verifPlayerName(timer = 600) {
    this.playerNameStatus = 0;
    window.clearTimeout(this.timerEvent);
    if (this.playerName.length <= 0) {
      this.playerNameStatus = 0;
    } else if (this.playerName.length > 30) {
      this.playerNameStatus = 4;
    } else if (utils.regex.test(this.playerName) === false) {
      this.playerNameStatus = 3;
    } else {
      this.timerEvent = window.setTimeout(() => {
        this.roomService.testIfPlayerNameIsFree(this.playerName)
          .then(res => {
            if (res.status) {
              this.playerNameStatus = 1;
            }
            else {
              this.playerNameStatus = 2;
            }
            if (res.isPlaying) {
              this.isPlaying = true;
            } else {
              this.isPlaying = false;
            }

          })
          .catch(err => {
            if (this.userEmit === false) {
              this.toastService.createMessage('error', err);
              this.roomService.selectedRoomId = undefined;
              this.router.navigate(['create']);
            }
          });
      }, timer);
    }
  }

  createPlayer() {
    this.roomService.createPlayer(this.playerName)
      .then(res => {
        this.userEmit = true;
        window.clearInterval(this.timerEvent);
        this.toastService.createMessage('success', res);
        this.roomService.goToGame();
      })
      .catch(err => { this.toastService.createMessage('error', err); });
  }


}
