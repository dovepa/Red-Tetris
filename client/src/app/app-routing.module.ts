import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { hashKey } from './customUrlSerializer';
import { HomeComponent } from './vues/home/home.component';
import { PlayerComponent } from './vues/player/player.component';
import { RoomListComponent } from './vues/room-list/room-list.component';
import { UserRoadComponent } from './vues/user-road/user-road.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: `${hashKey}:roomName[:playerName]`,
    component: UserRoadComponent,
    pathMatch: 'full',
  },
  {
    path: 'room',
    component: RoomListComponent,
    pathMatch: 'full',
  },
  {
    path: 'play',
    component: UserRoadComponent,
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
