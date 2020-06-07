import { Injectable } from '@angular/core';
import { Room } from '../model/room.model';
import axios from 'axios';
import * as utils from '../utils';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor() { }

  async testIfRoomNameIsFree(name: string): Promise<boolean> {
    let status = false;
    await axios.post(utils.apiUrl('room', 'test'), { name })
      .then((res) => {
        status = res.data;
      });
    return status;
  }

  async getAllRooms(): Promise<Room[]> {
    let list: Room[] = [];
    await axios.get(utils.apiUrl('room', 'getAll'))
      .then((res) => {
        if (res.data) {
          list = res.data;
        }
      });
    return list;
  }

  createRoom(room) {

    return;
  }



  async getRoom(id: string): Promise<Room> {
    let room: Room;
    await axios.post(utils.apiUrl('room', 'getRoom'), { id })
      .then((res) => {
        room = res.data;
      });
    return room;
  }
}
