import { Component, OnInit } from '@angular/core';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  roomName = '';
  mode: string;
  status: number;

  constructor(private readonly roomService: RoomService) {
    this.status = 0;
    this.mode = 'multiplayer';
  }

  verifRoomName() {
    this.status = 0;
    if (this.roomName.length < 1) {
    } else if (this.roomName.length > 30) {
      this.status = 4;
    } else if (utils.regex.test(this.roomName) === false) {
      this.status = 3;
    } else {
      if (this.roomService.testIfRoomNameIsFree(this.roomName)) {
        this.status = 1;
      }
      else {
        this.status = 2;
      }
    }
  }

  ngOnInit(): void {
  }

}
