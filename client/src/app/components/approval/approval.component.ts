import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit, OnDestroy {

  percent: number;
  timerEvent: number | undefined;

  constructor(private readonly router: Router,
              private readonly toastService: ToastService,
              private readonly roomService: RoomService) {
    this.percent = 0;
  }

  ngOnInit(): void {
    this.timerEvent = window.setInterval((() => {
      if (this.percent < 100) {
        this.percent++;
      }
      if (this.percent === 100) {
        this.roomService.resetAll();
        this.toastService.createMessage('error', 'The roomMaster not accept you 😢');
        this.router.navigate(['room']);
      }
    }), 200);
  }

  ngOnDestroy() {
    window.clearInterval(this.timerEvent);
  }

}
