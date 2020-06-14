import { Component, OnInit } from '@angular/core';
import * as utils from '../../utils';
import { Room } from 'src/app/model/room.model';
import { Player } from 'src/app/model/player.model';
import { RoomService } from 'src/app/service/room.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  sum: number;
  search: string;
  roomList: Room[];
  finalArray: Room[] = [];
  error: boolean;
  searchTmp: Room[];

  constructor(private readonly roomService: RoomService,
              private readonly socket: Socket,
              private readonly router: Router) {
    this.error = false;
    this.roomList = [];

    this.getRooms();
    this.searchTmp = this.roomList;
    this.sum = 0;
    this.appendItems();

    this.socket.on('roomUpdate', async (data) => {
      utils.log('Socket :: roomUpdate');
      if (data && data.room) {
        this.roomList.forEach(r => {
          if (r.id === data.room.id) {
            r = data.room;
          }
        });
      } else {
        await this.getRooms();
        this.searchRoom();
      }
    });
  }

  async getRooms() {
    this.roomList = await this.roomService.getAllRooms();
    this.searchRoom();
  }

  searchRoom() {
    this.error = false;
    if (utils.regex.test(this.search) === false) {
      this.error = true;
      return;
    }
    this.finalArray = [];
    this.searchTmp = [];
    if (!this.search || this.search.length === 0) {
      this.searchTmp = this.roomList;
    } else {
      this.roomList.forEach(room => {
        if (room.roomName.includes(this.search)) {
          this.searchTmp.push(room);
        }
      });
    }
    this.sum = 0;
    this.appendItems();
  }

  ngOnInit(): void {
  }

  selectRoom(roomId: string) {
    this.roomService.selectedRoomId = roomId;
    this.router.navigate(['play']);
  }

  appendItems() {
    this.sum += 20;
    const start = this.finalArray.length.valueOf();
    for (let i = 0; i < this.sum; ++i) {
      if (this.searchTmp[start + i] && this.finalArray.includes(this.searchTmp[start + i]) === false) {
        this.finalArray.push(this.searchTmp[start + i]);
      }
    }
  }

}
