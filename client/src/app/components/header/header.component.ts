import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as utils from '../../utils';
import { RoomService } from 'src/app/service/room.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeVue: string;
  constructor(private readonly router: Router,
              private readonly roomService: RoomService) {
    this.router.events.subscribe((event) => {
      this.activeVue = this.router.url;
      utils.log('route changed', this.activeVue);
    });
  }

  ngOnInit(): void {
  }

}
