import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';
import { Subject } from 'rxjs';
import * as utils from './../utils';
import { GameComponent } from '../components/game/game.component';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuardService {


  constructor(private modalService: NgbModal,
              private readonly socketService: SocketService,
              private readonly socket: Socket) { }

  canDeactivate(gameComponenet: GameComponent) {
    if (gameComponenet.exit) {
      this.socket.emit('playerLeave', this.socketService.socketId);
      return gameComponenet.exit;
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
        this.socket.emit('playerLeave', this.socketService.socketId);
      }
      utils.log(`Pending changes guard ${response}`);
      return response;
    });
  }
}
