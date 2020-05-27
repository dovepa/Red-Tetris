import { Component, OnInit } from '@angular/core';
import * as utils from '../../utils';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  sum: number;
  search: string;
  roomList: string[];
  finalArray = [];
  error: boolean;
  searchTmp: string[];

  constructor() {
    this.error = false;
    this.roomList = [];
    let i = 0;
    while (i < 300) {
      this.roomList.push('' + i);
      i++;
    }
    this.searchTmp = this.roomList;
    this.sum = 0;
    this.appendItems();
  }

  searchRoom() {
    this.error = false;
    if (utils.regex.test(this.search) === false) {
      this.error = true;
      return;
    }
    this.finalArray = [];
    this.searchTmp = [];
    if (this.search.length === 0) {
      this.searchTmp = this.roomList;
    } else {
      this.roomList.forEach(room => {
        if (room.includes(this.search)) {
          this.searchTmp.push(room);
        }
      });
    }
    this.sum = 0;
    this.appendItems();
  }

  ngOnInit(): void {
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
