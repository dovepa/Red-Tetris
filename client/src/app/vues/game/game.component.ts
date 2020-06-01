import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/player.model';
import { Room } from 'src/app/model/room.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  room: Room;
  me: Player;
  playerList: Player[];
  constructor() {
    let i = 0;
    this.playerList = [];
    while (i < 8) {
      const player = new Player(i.toString(), i.toString());
      player.score = (i * 100 + 300) % 41;
      this.playerList.push(player);
      i++;
    }
    this.room = new Room('aaa');
    this.room.master = this.playerList[4];
    this.me = this.playerList[4];

    this.playerList.sort((a, b) => (b.score - a.score));
  }

  ngOnInit(): void {
  }

}
