import { Component, OnInit, OnDestroy } from '@angular/core';
import * as utils from '../../utils';
import { Player, Score } from 'src/app/model/player.model';
import { Socket } from 'ngx-socket-io';
import { RoomService } from 'src/app/service/room.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-best-score',
  templateUrl: './best-score.component.html',
  styleUrls: ['./best-score.component.scss']
})
export class BestScoreComponent implements OnInit, OnDestroy {

  sum = 0;
  listPlayers: Score[] = [];
  arrayTmp: Score[] = [];
  search: string;
  finalArray: Score[] = [];
  error: boolean;
  subscription: Subscription;

  constructor(private readonly socket: Socket,
              private readonly roomService: RoomService,
              private readonly socketService: SocketService) {

    this.socket.on('updatePlayer', async () => { this.socket.emit('getAllScores', { id: this.socketService.socketId }); });
    this.socket.emit('getAllScores', { id: this.socketService.socketId });
    this.subscription = this.socketService.socketIdSetterObs.subscribe(() => {
      this.socket.emit('getAllScores', { id: this.socketService.socketId });
    });

    this.socket.on('resGetAllScores', async (data) => {
      const scoreList: Score[] = [];
      if (data && data.list) {
        data.list.forEach((player: Player) => {
          if (player.scores) {
            player.scores.forEach(scoreInfo => {
              scoreList.push({ name: player.name, roomId: player.roomId, score: scoreInfo.score, date: scoreInfo.date });
            });
          }
        });
      }
      scoreList.sort((a, b) => b.score - a.score);
      this.sum = 0;
      this.listPlayers = scoreList;
      this.arrayTmp = scoreList;
      this.appendItems();
    });

  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
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
