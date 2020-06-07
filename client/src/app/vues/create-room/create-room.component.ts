import { Component, OnInit } from '@angular/core';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  mode: string;
  playerName = '';
  playerNameStatus: number;
  roomName = '';
  roomNameStatus: number;
  timerEvent: number | undefined;

  constructor(private readonly roomService: RoomService) {
    this.roomNameStatus = 0;
    this.playerNameStatus = 0;
    this.mode = 'multiplayer';
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

  async verifRoomName() {
    this.roomNameStatus = 0;
    window.clearTimeout(this.timerEvent);
    if (this.roomName.length <= 0) {
      this.roomNameStatus = 0;
    } else if (this.roomName.length > 30) {
      this.roomNameStatus = 4;
    } else if (utils.regex.test(this.roomName) === false) {
      this.roomNameStatus = 3;
    } else {
      this.timerEvent = window.setTimeout(async () => {
        const isFree = await this.roomService.testIfRoomNameIsFree(this.roomName);
        if (isFree) {
          this.roomNameStatus = 1;
        }
        else {
          this.roomNameStatus = 2;
        }
      }, 600);
    }
  }

  createRoom() {

  }

  ngOnInit(): void {
  }

}
