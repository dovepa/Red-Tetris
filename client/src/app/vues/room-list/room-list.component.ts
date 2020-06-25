import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { Piece } from 'src/app/model/piece.model';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {

  sum: number;
  search: string;
  roomList: Piece[];
  finalArray: Piece[] = [];
  error: boolean;
  searchTmp: Piece[];

  subscription: Subscription;
  constructor(private readonly roomService: RoomService,
              private readonly socket: Socket,
              private readonly socketService: SocketService,
              private readonly router: Router) {
    this.error = false;
    this.roomList = [];

    this.searchTmp = this.roomList;
    this.sum = 0;
    this.appendItems();

    this.socket.emit('getAllRooms', { id: this.socketService.socketId });
    this.subscription = this.socketService.socketIdSetterObs.subscribe(() => {
      this.socket.emit('getAllRooms', { id: this.socketService.socketId });
    });

    this.socket.on('resGetAllRooms', async (data) => {
      if (data.id === this.socketService.socketId) {
        this.roomList = data.list;
        this.searchRoom();
      }
    });

    this.socket.on('updateRoom', (async (data) => {
      this.socket.emit('getAllRooms', { id: this.socketService.socketId });
    }));
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
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
        if (room.id.includes(this.search)) {
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
    this.router.navigate(['create']);
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
