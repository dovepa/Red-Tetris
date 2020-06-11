import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from 'src/app/model/player.model';
import { Room } from 'src/app/model/room.model';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  room: Room;
  me: Player;
  playerList: Player[];
  constructor(private readonly roomService: RoomService) {

    this.room = this.roomService.currentRoom;

    this.playerList = [];
    this.playerList.sort((a, b) => (b.score - a.score));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.roomService.currentPlayer = undefined;
    this.roomService.currentRoom = undefined;
  }
}
