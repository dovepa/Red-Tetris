import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit, OnDestroy {

  mode: string;
  playerName = '';
  playerNameStatus: number;
  roomId = '';
  roomIdStatus: number;
  timerEvent: number | undefined;
  constructor(private readonly roomService: RoomService,
              private readonly socketService: SocketService,
              private readonly toastService: ToastService,
              private readonly socket: Socket
  ) {
    this.roomIdStatus = 0;
    this.playerNameStatus = 0;
    this.mode = 'multiplayer';

    this.socket.on('resCreateRoom', async (data) => {
      if (data && data.error) {
        this.toastService.createMessage('error', data.error);
        this.roomId = '';
        this.playerName = '';
        this.verifRoomId();
        this.verifPlayerName();
      }
    });

    this.socket.on('updateRoom', async (data) => {
      if (this.roomService && data && data.room && data.room.id
        && data.room.id === this.roomService.selectedRoomId && !data.room.isDeleted) {
        this.verifRoomId();
      }
    });

    this.socket.on('resTestRoom', async (data) => {
      if (data.isFree) {
        this.roomIdStatus = 1;
      }
      else {
        this.roomIdStatus = 2;
      }
    });
  }

  ngOnDestroy(): void {
  }


  async verifPlayerName() {
    this.playerNameStatus = 0;
    if (this.playerName.length <= 0) {
      this.playerNameStatus = 0;
    } else if (this.playerName.length > 30) {
      this.playerNameStatus = 4;
    } else if (utils.regex.test(this.playerName) === false) {
      this.playerNameStatus = 3;
    } else {
      this.playerNameStatus = 1;
    }
  }

  async verifRoomId(timer = 600) {
    this.roomIdStatus = 0;
    window.clearTimeout(this.timerEvent);
    if (this.roomId.length <= 0) {
      this.roomIdStatus = 0;
    } else if (this.roomId.length > 30) {
      this.roomIdStatus = 4;
    } else if (utils.regex.test(this.roomId) === false) {
      this.roomIdStatus = 3;
    } else {
      this.timerEvent = window.setTimeout(async () => {
        this.socket.emit('testRoom', { id: this.socketService.socketId, roomId: this.roomId });
      }, timer);
    }
  }

  async createRoom() {
    if (this.roomId && this.playerName && this.mode) {
      this.socket.emit('createRoom',
        { roomId: this.roomId, playerName: this.playerName, mode: this.mode, id: this.socketService.socketId });
    }
  }

  ngOnInit(): void {
  }

}
