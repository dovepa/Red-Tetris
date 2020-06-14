import * as utils from './utils';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './customUrlSerializer';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './vues/player/player.component';
import { HomeComponent } from './vues/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import { RoomListComponent } from './vues/room-list/room-list.component';
import { TetrisGridComponent } from './components/tetris-grid/tetris-grid.component';
import { ModePipe } from './pipes/mode.pipe';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { UserRoadComponent } from './vues/user-road/user-road.component';
import { GameComponent } from './components/game/game.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { CreatePlayerComponent } from './components/create-player/create-player.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';

const config: SocketIoConfig = { url: utils.urlServer(), options: {} };

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    GameComponent,
    HomeComponent,
    HeaderComponent,
    CreateRoomComponent,
    ToastComponent,
    RoomListComponent,
    TetrisGridComponent,
    ModePipe,
    CreatePlayerComponent,
    UserRoadComponent,
    ApprovalComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    NgbModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
