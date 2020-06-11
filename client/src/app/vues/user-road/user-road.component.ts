import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';
import { Room } from 'src/app/model/room.model';
import { Player } from 'src/app/model/player.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-road',
  templateUrl: './user-road.component.html',
  styleUrls: ['./user-road.component.scss']
})
export class UserRoadComponent implements OnInit, OnDestroy {

  selectedRoom: string;
  currentRoom: Room;
  currentPlayer: Player;

  subscription: Subscription;

  constructor(private readonly roomService: RoomService) {
    this.subscription = this.roomService.updateCurrentDataObs.subscribe(() => { this.ngOnInit(); });
  }

  ngOnInit(): void {
    this.selectedRoom = this.roomService.selectedRoomId;
    this.currentPlayer = this.roomService.currentPlayer;
    this.currentRoom = this.roomService.currentRoom;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
