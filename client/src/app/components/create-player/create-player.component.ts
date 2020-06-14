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

  constructor(private readonly roomService: RoomService,
              private readonly toastService: ToastService,
              private readonly router: Router,
              private readonly socket: Socket) {

    this.socket.on('playerUpdate', roomName => {
      utils.log('Socket :: playerUpdate', roomName);
      if (this.roomService.selectedRoomName === roomName) {
        this.verifPlayerName();
      }
    });

    this.socket.on('updateRoom', data => {
      if (data && data.room && data.room.id === this.roomService.selectedRoomName) {
        this.verifPlayerName();
      }
    });
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
            this.toastService.createMessage('error', err);
            this.router.navigate(['room']);
            this.roomService.selectedRoomId = undefined;
          });
      }, timer);
    }
  }

  createPlayer() {
    this.roomService.createPlayer(this.playerName)
      .then(res => { this.toastService.createMessage('success', res); })
      .catch(err => { this.toastService.createMessage('error', err); });
  }

  ngOnDestroy() {
    this.roomService.selectedRoomId = undefined;
  }
}
