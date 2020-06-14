import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/model/player.model';
import { Room } from 'src/app/model/room.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  selectedRoom: string;
  subscription: Subscription;

  constructor(private readonly roomService: RoomService) {
    this.subscription = this.roomService.updateCurrentDataObs.subscribe(() => { this.ngOnInit(); });
  }

  ngOnInit(): void {
    this.selectedRoom = this.roomService.selectedRoomId;
    console.log('room id', this.selectedRoom);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
