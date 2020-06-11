import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socketId: string;
  constructor() { }

  destroySocket(id: string): void {

  }
}
