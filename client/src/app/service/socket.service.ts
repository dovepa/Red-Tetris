import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socketId: string;
  constructor(private readonly socket: Socket) { }

  resetSocket() {
    this.socket.disconnect(true);
    this.socket.connect();
  }
}
