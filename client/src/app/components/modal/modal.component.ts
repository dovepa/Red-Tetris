import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  title: string;
  content: string;
  yes: string;
  no: string;
  percent: number;
  timerEvent: number | undefined;
  public subject: Subject<boolean>;

  constructor(public activeModal: NgbActiveModal) {
    this.percent = 100;
  }

  ngOnInit(): void {
    this.timerEvent = window.setInterval((() => {
      if (this.percent > 0) {
        this.percent--;
      }
      if (this.percent === 0) {
        this.clickNo();
      }
    }), 200);
  }

  ngOnDestroy() {
    window.clearInterval(this.timerEvent);
  }

  clickYes() {
    if (this.subject) {
      this.subject.next(true);
      this.subject.complete();
    }
    this.activeModal.close(true);
    this.ngOnDestroy();
  }

  clickNo() {
    if (this.subject) {
      this.subject.next(false);
      this.subject.complete();
    }
    this.activeModal.close(false);
    this.ngOnDestroy();
  }
}
