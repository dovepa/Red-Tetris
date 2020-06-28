import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisGridComponent } from './tetris-grid.component';

import { RouterTestingModule } from '@angular/router/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { Piece } from 'src/app/model/piece.model';
import { Player } from 'src/app/model/player.model';
const config: SocketIoConfig = { url: environment.serverAdress + environment.serverPort, options: {} };

describe('TetrisGridComponent', () => {
  let component: TetrisGridComponent;
  let fixture: ComponentFixture<TetrisGridComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SocketIoModule.forRoot(config),
        RouterTestingModule,
      ],
      declarations: [TetrisGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TetrisGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.roomService.currentRoom = new Piece('test', 1);
    component.roomService.currentPlayer = new Player('test', 'Dove', 'socketId-test0123456789');
  });

  it('should be return piece', () => {
    expect(component.roomService.currentRoom).toBeInstanceOf(Piece);
  });

  it('should be return Player', () => {
    expect(component.roomService.currentPlayer).toBeInstanceOf(Player);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
