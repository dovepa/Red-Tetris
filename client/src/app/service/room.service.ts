import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor() { }

  testIfRoomNameIsFree(name): boolean {
    return true;
  }

  createRoom(room) {
    return;
  }

  getAllRooms() {
    return;
  }


}
