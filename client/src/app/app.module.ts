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
import { BestScoreComponent } from './vues/best-score/best-score.component';
import { HammerModule } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';


const config: SocketIoConfig = { url: utils.urlServer(), options: {} };

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
  } as any;
}

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
    ModalComponent,
    CreateComponent,
    BestScoreComponent,
    AdminPanelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    NgbModule,
    SocketIoModule.forRoot(config),
    StoreModule.forRoot(reducers, {
      metaReducers, 
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer },
  {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig,
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
