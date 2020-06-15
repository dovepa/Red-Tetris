import * as utils from './utils';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './customUrlSerializer';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './vues/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import { RoomListComponent } from './vues/room-list/room-list.component';
import { TetrisGridComponent } from './components/tetris-grid/tetris-grid.component';
import { ModePipe } from './pipes/mode.pipe';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { CreatePlayerComponent } from './components/create-player/create-player.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';
import { CreateComponent } from './vues/create/create.component';
import { GameComponent } from './vues/game/game.component';
import { ApprovalComponent } from './vues/approval/approval.component';
import { BestScoreComponent } from './vues/best-score/best-score.component';
import { HammerModule } from '@angular/platform-browser';

const config: SocketIoConfig = { url: utils.urlServer(), options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    HeaderComponent,
    CreateRoomComponent,
    ToastComponent,
    RoomListComponent,
    TetrisGridComponent,
    ModePipe,
    CreatePlayerComponent,
    CreateComponent,
    ApprovalComponent,
    ModalComponent,
    CreateComponent,
    BestScoreComponent,
  ],
  imports: [
    BrowserModule,
    HammerModule,
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
