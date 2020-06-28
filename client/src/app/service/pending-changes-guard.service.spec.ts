import { TestBed } from '@angular/core/testing';

import { PendingChangesGuardService } from './pending-changes-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
const config: SocketIoConfig = { url: environment.serverAdress + environment.serverPort, options: {} };

describe('PendingChangesGuardService', () => {
  let service: PendingChangesGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SocketIoModule.forRoot(config),
        RouterTestingModule,
      ],
    });
    service = TestBed.inject(PendingChangesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
