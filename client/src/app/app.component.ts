import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as utils from './utils';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './service/socket.service';
import { PendingChangesGuardService } from './service/pending-changes-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Red-Tetris';

  constructor(private readonly socket: Socket,
              private readonly socketService: SocketService) {
    socket.on('connect', () => {
      utils.log(`Socket id :: ${this.socket.ioSocket.id}`);
      this.socketService.socketId = this.socket.ioSocket.id;
    });
  }
}
