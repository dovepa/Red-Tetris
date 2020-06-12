import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';
import { Subject } from 'rxjs';
import * as utils from './../utils';

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuardService {


  constructor(private modalService: NgbModal) { }

  canDeactivate() {
    let subject = new Subject<boolean>();
    const modalRef = this.modalService.open(ModalComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.title = 'Leave the room 😱';
    modalRef.componentInstance.content = 'Are you sure that you want to leave the room ?  💔';
    modalRef.componentInstance.yes = 'Leave';
    modalRef.componentInstance.no = 'Cancel';
    subject = modalRef.componentInstance.subject;
    return modalRef.result.then(response => {
      utils.log(`Pending changes guard ${response}`);
      return response;
    });
  }
}
