import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  sum: number;
  listPlayers = [];
  array = [];

  constructor() { }

  ngOnInit(): void {
    this.sum = 0;
    this.appendItems();
  }

  appendItems() {
    this.sum += 20;
    const start = this.array.length.valueOf();
    for (let i = 0; i < this.sum; ++i) {
      if (this.listPlayers[start + i] && this.array.includes(this.listPlayers[start + i]) === false) {
        this.array.push(this.listPlayers[start + i]);
      }
    }
  }

}
