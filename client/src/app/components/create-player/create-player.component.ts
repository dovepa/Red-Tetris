import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/service/socket.service';

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
              private readonly socketService: SocketService,
              private readonly router: Router,
              private readonly socket: Socket) {

    this.socket.on('updateRoom', async (data) => {
      if (data && data.room && data.room.id === this.roomService.selectedRoomId) {
        this.verifPlayerName();
      }
    });

    this.socket.on('resTestPlayer', async (data) => {
      if (data.error) {
        if (this.userEmit === false) {
          this.toastService.createMessage('error', data.error);
          this.roomService.selectedRoomId = undefined;
          this.router.navigate(['create']);
        }
      } else {
        if (data.status) {
          this.playerNameStatus = 1;
        }
        else {
          this.playerNameStatus = 2;
        }
        if (data.isPlaying) {
          this.isPlaying = true;
        } else {
          this.isPlaying = false;
        }
      }
    });

    this.socket.on('resCreatePlayer', async (data) => {
      if (data && data.error) {
        this.toastService.createMessage('error', data.error);
      }
      else {
        this.userEmit = true;
      }
    });

  }


  ngOnDestroy() {
    this.roomService.selectedRoomId = undefined;
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
        this.socket.emit('testPlayer',
          { playerName: this.playerName, roomId: this.roomService.selectedRoomId, id: this.socketService.socketId });
      }, timer);
    }
  }

  createPlayer() {
    this.socket.emit('createPlayer',
      { playerName: this.playerName, roomId: this.roomService.selectedRoomId, id: this.socketService.socketId });
  }


}
