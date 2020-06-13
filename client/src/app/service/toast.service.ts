import { Injectable } from '@angular/core';
import { ToastMessage } from '../model/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  toastMessageList: ToastMessage[] = [];

  getMessageList(): ToastMessage[] {
    return this.toastMessageList;
  }

  createMessage(title: string, message: string) {
    const toastMessage: ToastMessage = { title, message, open: true, percent: 100 };
    this.toastMessageList.push(toastMessage);
  }

}
