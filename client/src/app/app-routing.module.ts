import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { hashKey } from './customUrlSerializer';
import { HomeComponent } from './vues/home/home.component';
import { GameComponent } from './vues/game/game.component';
import { PlayerComponent } from './vues/player/player.component';
import { RoomListComponent } from './vues/room-list/room-list.component';
import { CreateRoomComponent } from './vues/create-room/create-room.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: `${hashKey}:roomName[:playerName]`,
    component: GameComponent,
    pathMatch: 'full',
  },
  {
    path: 'room',
    component: RoomListComponent,
    pathMatch: 'full',
  },
  {
    path: 'createRoom',
    component: CreateRoomComponent,
    pathMatch: 'full',
  },
  {
    path: 'players',
    component: PlayerComponent,
    pathMatch: 'full',
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'ignore'
  })],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
