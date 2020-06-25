import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';
import { Subject } from 'rxjs';
import * as utils from './../utils';
import { Socket } from 'ngx-socket-io';
import axios from 'axios';
import { GameComponent } from '../vues/game/game.component';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuardService implements OnDestroy {


  constructor(private modalService: NgbModal,
              private readonly socket: Socket,
              private readonly roomService: RoomService) { }


  ngOnDestroy() {
  }



  canDeactivate(component: GameComponent) {
    if (component.reset) {
      this.roomService.resetAll();
    }
    if (component.exit) {
      return component.exit;
    }
    let subject = new Subject<boolean>();
    const modalRef = this.modalService.open(ModalComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.title = 'Leave the room 😱';
    modalRef.componentInstance.content = 'Are you sure that you want to leave the room ?  💔';
    modalRef.componentInstance.yes = 'Leave';
    modalRef.componentInstance.no = 'Cancel';
    subject = modalRef.componentInstance.subject;
    return modalRef.result.then(response => {
      if (response) {
        this.roomService.resetAll();
      }
      utils.log(`Pending changes guard ${response}`);
      return response;
    });
  }
}
