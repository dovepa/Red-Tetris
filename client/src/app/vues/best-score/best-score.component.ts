import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from '../../utils';
import { Player, Score } from 'src/app/model/player.model';
import { Socket } from 'ngx-socket-io';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-best-score',
  templateUrl: './best-score.component.html',
  styleUrls: ['./best-score.component.scss']
})
export class BestScoreComponent implements OnInit, OnDestroy {

  sum: number;
  listPlayers: Score[];
  arrayTmp: Score[] = [];
  search: string;
  finalArray: Score[] = [];
  error: boolean;

  constructor(private readonly socket: Socket,
              private readonly roomService: RoomService) {
    this.socket.on('updatePlayer', this.findPlayersScore.bind(this));
    this.findPlayersScore();
  }

  ngOnDestroy() {
    this.socket.removeListener('updatePlayer', this.findPlayersScore.bind(this));
  }

  findPlayersScore() {
    this.roomService.getPlayerListScore().then((res: Score[]) => {
      this.sum = 0;
      this.listPlayers = res;
      this.arrayTmp = res;
      this.appendItems();
    });
  }

  async searchPlayer() {
    this.error = false;
    if (utils.regex.test(this.search) === false) {
      this.error = true;
      return;
    }
    this.finalArray = [];
    this.arrayTmp = [];
    if (this.search.length === 0) {
      this.arrayTmp = this.listPlayers;
    } else {
      this.listPlayers.forEach(player => {
        if (player.name.includes(this.search) || player.roomId.includes(this.search)) {
          this.arrayTmp.push(player);
        }
      });
    }
    this.sum = 0;
    this.appendItems();
  }

  ngOnInit(): void {
    this.sum = 0;
    this.appendItems();
  }

  async appendItems() {
    this.sum += 20;
    const start = this.finalArray.length.valueOf();
    for (let i = 0; i < this.sum; ++i) {
      if (this.arrayTmp[start + i] && this.finalArray.includes(this.arrayTmp[start + i]) === false) {
        this.finalArray.push(this.arrayTmp[start + i]);
      }
    }
  }

}
