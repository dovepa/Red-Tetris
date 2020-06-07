import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastMessage } from 'src/app/model/toast.model';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  toastMessageList: ToastMessage[] = [];

  constructor(private readonly toastService: ToastService) {
    this.toastMessageList = this.toastService.getMessageList();
  }

  ngOnInit(): void {
    setInterval((() => {
      if (this.toastMessageList && !this.toastMessageList.every(toast => toast.open === false)) {
        this.toastMessageList.forEach(toast => {
          if (toast.open) {
            if (toast.percent <= 0) {
              toast.open = false;
            } else {
              toast.percent = toast.percent - 1;
            }
          }
        });
      }
    }), 100);
  }


  close(toast: ToastMessage) {
    toast.percent = 5;
  }

}
