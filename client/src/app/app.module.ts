import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './customUrlSerializer';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './vues/player/player.component';
import { GameComponent } from './vues/game/game.component';
import { HomeComponent } from './vues/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatComponent } from './components/chat/chat.component';
import { CreateRoomComponent } from './vues/create-room/create-room.component';
import { ToastComponent } from './components/toast/toast.component';
import { RoomListComponent } from './vues/room-list/room-list.component';
import { TetrisGridComponent } from './components/tetris-grid/tetris-grid.component';
import { ModePipe } from './pipes/mode.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    GameComponent,
    HomeComponent,
    HeaderComponent,
    ChatComponent,
    CreateRoomComponent,
    ToastComponent,
    RoomListComponent,
    TetrisGridComponent,
    ModePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
  ],
  providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
