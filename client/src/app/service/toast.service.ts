import { Injectable } from '@angular/core';
import { ToastMessage, ToastAction } from '../model/toast.model';
import { Player } from '../model/player.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  toastMessageList: ToastMessage[] = [];
  toastActionList: ToastAction[] = [];


  getMessageList(): ToastMessage[] {
    return this.toastMessageList;
  }

  getActionList(): ToastAction[] {
    return this.toastActionList;
  }

  createMessage(title: string, message: string) {
    const toastMessage: ToastMessage = { title, message, open: true, percent: 100 };
    this.toastMessageList.push(toastMessage);
  }

  createAction(title: string, message: string, roomId: string, player: Player) {
    const toastAction: ToastAction = { title, message, roomId, player, open: true, percent: 100 };
    this.toastActionList.push(toastAction);
  }

}
