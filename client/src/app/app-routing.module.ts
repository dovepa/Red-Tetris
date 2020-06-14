import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { hashKey } from './customUrlSerializer';
import { HomeComponent } from './vues/home/home.component';
import { RoomListComponent } from './vues/room-list/room-list.component';
import { PendingChangesGuardService } from './service/pending-changes-guard.service';
import { ApprovalComponent } from './vues/approval/approval.component';
import { GameComponent } from './vues/game/game.component';
import { CreateComponent } from './vues/create/create.component';
import { BestScoreComponent } from './vues/best-score/best-score.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: `${hashKey}:roomId[:playerName]`,
    component: GameComponent,
    pathMatch: 'full',
    canDeactivate: [PendingChangesGuardService]
  },
  {
    path: 'room',
    component: RoomListComponent,
    pathMatch: 'full',
  },
  {
    path: `approval`,
    component: ApprovalComponent,
    pathMatch: 'full',
    canDeactivate: [PendingChangesGuardService]
  },
  {
    path: 'create',
    component: CreateComponent,
    pathMatch: 'full',
  },
  {
    path: 'players',
    component: BestScoreComponent,
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
