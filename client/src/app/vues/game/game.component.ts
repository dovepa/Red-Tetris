import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';
import { Router } from '@angular/router';
import * as utils from '../../utils';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  paramRoomId: string;
  paramPlayerName: string;

  exit = false;
  reset = false;

  changeGuard(exit: boolean = false, reset: boolean = false) {
    this.exit = exit;
    this.reset = reset;
  }

  constructor(readonly roomService: RoomService,
              private readonly toastService: ToastService,
              private readonly socketService: SocketService,
              private readonly socket: Socket,
              private readonly router: Router) {
  }


  ngOnInit(): void {
    const url = this.router.url;
    if (utils.gameRegex.test(url) === false) {
      this.changeGuard(true, true);
      this.router.navigate(['room']);
      this.toastService.createMessage('error', 'Error on room link 😞');
    } else {
      this.paramRoomId = url.split('#')[1].split('[')[0];
      this.paramPlayerName = url.split('[')[1].split(']')[0];
      if (
        !this.roomService.currentPlayer
        || !this.roomService.currentPlayer.grid
        || !this.roomService.currentPlayer.grid.shape
        || !this.roomService.currentRoom
        || this.paramRoomId !== this.roomService.currentRoom.id
        || this.paramPlayerName !== this.roomService.currentPlayer.name
        || this.roomService.currentRoom.playersId.includes(this.roomService.currentPlayer.id) === false
      ) {
        this.toastService.createMessage('success', 'Create a new player for join the room 😃');
        this.roomService.currentRoom = undefined;
        this.roomService.currentPlayer = undefined;
        this.roomService.selectedRoomId = this.paramRoomId.valueOf();
        this.changeGuard(true, false);
        this.router.navigate(['create']);
      }
    }
  }

}
