import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
const config: SocketIoConfig = { url: environment.serverAdress + environment.serverPort, options: {} };

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SocketIoModule.forRoot(config),
        RouterTestingModule,
      ],
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
