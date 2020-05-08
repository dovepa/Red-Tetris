import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'front';

  constructor(private socket: Socket) { }

  ngOnInit() {
    this.socket.emit('hello');
    console.log('hello');
  }
}
