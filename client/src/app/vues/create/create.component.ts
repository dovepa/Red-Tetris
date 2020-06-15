import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  constructor(readonly roomService: RoomService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

}
