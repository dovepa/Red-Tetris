import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(readonly roomService: RoomService) { }

  ngOnInit(): void {
  }

  setPause(pause: boolean) {
    if (this.roomService.currentRoom.pause !== pause) {
      this.roomService.currentRoom.pause = pause;
      this.roomService.editRoomAdmin();
    }
  }

  play() {
    this.roomService.currentRoom.isPlaying = true;
    this.roomService.editRoomAdmin();
  }


}
