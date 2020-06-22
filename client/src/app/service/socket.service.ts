import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as utils from '../utils';
@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  public socketId: string;
  constructor(private readonly socket: Socket) {
    socket.on('connect', () => {
      utils.log(`Socket id :: ${this.socket.ioSocket.id}`);
      this.socketId = this.socket.ioSocket.id;
    });
  }

  ngOnDestroy() {
    this.socket.removeAllListeners();
  }

}
