import { Component, OnInit } from '@angular/core';
import * as utils from '../../utils';
import { Player } from 'src/app/model/player.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  sum: number;
  listPlayers: Player[] = [];
  arrayTmp: Player[] = [];
  search: string;
  finalArray: Player[] = [];
  error: boolean;

  constructor() {
    this.sum = 0;
    this.arrayTmp = this.listPlayers;
    this.appendItems();
  }


  searchPlayer() {
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

  appendItems() {
    this.sum += 20;
    const start = this.finalArray.length.valueOf();
    for (let i = 0; i < this.sum; ++i) {
      if (this.arrayTmp[start + i] && this.finalArray.includes(this.arrayTmp[start + i]) === false) {
        this.finalArray.push(this.arrayTmp[start + i]);
      }
    }
  }

}
