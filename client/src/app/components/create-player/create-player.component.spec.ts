import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlayerComponent } from './create-player.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
const config: SocketIoConfig = { url: environment.serverAdress + environment.serverPort, options: {} };

describe('CreatePlayerComponent', () => {
  let component: CreatePlayerComponent;
  let fixture: ComponentFixture<CreatePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SocketIoModule.forRoot(config),
        RouterTestingModule
      ],
      declarations: [CreatePlayerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
