import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from 'src/app/model/player.model';
import { Room } from 'src/app/model/room.model';
import { RoomService } from 'src/app/service/room.service';
import { Router } from '@angular/router';
import * as utils from '../../utils';
import { ToastService } from 'src/app/service/toast.service';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  // *ngIf="currentPlayer !== undefined && currentRoom !== undefined && currentRoom.playersId.includes(currentPlayer.id)">

  exit = false;
  paramRoomName: string;
  paramPlayerName: string;

  room: Room;
  me: Player;
  playerList: Player[];
  constructor(private readonly roomService: RoomService,
              private readonly toastService: ToastService,
              private readonly socketService: SocketService,
              private readonly router: Router) {
    this.me = this.roomService.currentPlayer;
    this.room = this.roomService.currentRoom;
    this.playerList = [];
  }

  async getPlayerList() {
    this.playerList = await this.roomService.getPlayerList('dd');
    this.playerList.sort((a, b) => (b.score - a.score));
  }


  ngOnInit(): void {
    const url = this.router.url;
    if (utils.gameRegex.test(url) === false) {
      this.goHome();
    } else {
      this.paramRoomName = url.split('#')[1].split('[')[0];
      this.paramPlayerName = url.split('[')[1].split(']')[0];
      if (!this.me || !this.room || this.paramRoomName !== this.room.roomName || this.paramPlayerName !== this.me.name
        || this.room.playersId.includes(this.socketService.socketId) === false) {
        this.goHome();
      }
    }

  }

  goHome() {
    this.exit = true;
    this.router.navigate(['home']);
    this.toastService.createMessage('error', 'Error on room link 😞');
    this.roomService.resetAll();
  }

  ngOnDestroy() {
    this.roomService.currentPlayer = undefined;
    this.roomService.currentRoom = undefined;
  }
}
