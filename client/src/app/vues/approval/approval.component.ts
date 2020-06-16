import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/service/room.service';
import { ToastService } from 'src/app/service/toast.service';
import { Socket } from 'ngx-socket-io';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})

export class ApprovalComponent implements OnInit, OnDestroy {

  percent: number;
  timerEvent: number | undefined;

  exit = false;
  reset = false;
  changeGuard(exit: boolean = false, reset: boolean = false) {
    this.exit = exit;
    this.reset = reset;
  }

  constructor(private readonly router: Router,
              private readonly toastService: ToastService,
              private readonly roomService: RoomService,
              private readonly socket: Socket) {
    this.percent = 0;

    this.socket.on('userKnockSuccess', data => {
      if (this.roomService.currentPlayer && data.player.id === this.roomService.currentPlayer.id && data.room) {
        if (data.error) {
          this.changeGuard(true, true);
          this.router.navigate(['room']);
          this.toastService.createMessage('error', data.error);
        } else if (data.success) {
          if (this.roomService.currentPlayer.approval === false && data.player.approval) {
            this.toastService.createMessage('success', data.success);
          }
          this.changeGuard(true);
          this.roomService.currentRoom = data.room;
          this.roomService.currentPlayer = data.player;
          this.roomService.selectedRoomId = undefined;
          this.roomService.goToGame();
        }
      }
    });

  }



  ngOnInit(): void {
    if (!(!this.roomService.currentRoom && this.roomService.currentPlayer && this.roomService.currentPlayer.approval === false)) {
      this.changeGuard(true, true);
      this.router.navigate(['home']);
    }
    this.timerEvent = window.setInterval((() => {
      if (this.percent < 100) {
        this.percent++;
      }
      if (this.percent === 100) {
        this.toastService.createMessage('error', 'The roomMaster not accept you 😢');
        this.changeGuard(true, true);
        this.router.navigate(['room']);
      }
    }), 200);
  }

  ngOnDestroy() {
    window.clearInterval(this.timerEvent);
  }

}
