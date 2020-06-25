import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as utils from '../utils';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  public socketId: string;
  constructor(private readonly socket: Socket) {
    socket.on('connect', () => {
      utils.log(`Socket id :: ${this.socket.ioSocket.id}`);
      this.setSocketId(this.socket.ioSocket.id);
    });
  }

  private socketIdSetter = new Subject<any>();
  socketIdSetterObs = this.socketIdSetter.asObservable();
  setSocketId(id: string) {
    this.socketId = id;
    this.socketIdSetter.next();
  }

  ngOnDestroy() {
    this.socket.removeAllListeners();
  }

}
