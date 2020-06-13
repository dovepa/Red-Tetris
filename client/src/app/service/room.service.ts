import { Injectable } from '@angular/core';
import { Room } from '../model/room.model';
import axios from 'axios';
import * as utils from '../utils';
import { ToastService } from './toast.service';
import { SocketService } from './socket.service';
import { Player } from '../model/player.model';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public selectedRoomId: string;
  public currentRoom: Room;
  public currentPlayer: Player;
  public currentApproval: boolean;

  constructor(private readonly toastService: ToastService,
              private readonly socketService: SocketService,
              private modalService: NgbModal,
              private readonly socket: Socket) {

    this.socket.on('userKnock', data => {
      if (this.currentRoom && data.roomId === this.currentRoom.id
        && this.currentRoom.masterId === this.socketService.socketId) {
        this.userKnock(data.player);
      }
    });

    this.socket.on('userKnockSuccess', data => {
      if (data.player.id === this.socketService.socketId && data.room) {
        if (data.error) {
          this.toastService.createMessage('error', data.error);
          this.resetAll();
        } else if (data.success) {
          this.currentRoom = data.room;
          this.currentPlayer = data.player;
          this.selectedRoomId = undefined;
          this.currentApproval = undefined;
          this.toastService.createMessage('success', data.success);
          this.runUpdateCurrentData();
        }
      }
    });

  }

  private updateCurrentData = new Subject<any>();
  updateCurrentDataObs = this.updateCurrentData.asObservable();
  runUpdateCurrentData() {
    this.updateCurrentData.next();
  }

  resetAll() {
    this.selectedRoomId = undefined;
    this.currentRoom = undefined;
    this.currentPlayer = undefined;
    this.currentApproval = undefined;
    this.runUpdateCurrentData();
  }

  async testIfRoomNameIsFree(name: string): Promise<boolean> {
    let status = false;
    await axios.post(utils.apiUrl('room', 'testRoom'), { name })
      .then((res) => {
        status = res.data;
      });
    return status;
  }



  testIfPlayerNameIsFree(playerName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return axios.post(utils.apiUrl('room', 'testPlayer'), { playerName, roomId: this.selectedRoomId })
        .then((res) => {
          if (res.data.error) {
            reject(res.data.error);
          } else {
            resolve(res.data);
          }
        })
        .catch((err) => { reject(err); });
    });
  }



  async getAllRooms(): Promise<Room[]> {
    let list: Room[] = [];
    await axios.get(utils.apiUrl('room', 'getAllRooms'))
      .then((res) => {
        if (res.data) {
          list = res.data;
        }
      });
    return list;
  }

  createRoom(roomName, playerName, mode): Promise<string> {
    return new Promise((resolve, reject) => {
      return axios.post(utils.apiUrl('room', 'createRoom'), { roomName, playerName, mode, socketId: this.socketService.socketId })
        .then((res) => {
          if (res.data.success) {
            this.currentPlayer = res.data.player;
            this.currentRoom = res.data.room;
            this.runUpdateCurrentData();
            resolve(res.data.success);
          }
          else if (res.data.error) {
            reject(res.data.error);
          }
        })
        .catch((err) => { reject(err); });
    });
  }

  createPlayer(playerName): Promise<string> {
    return new Promise((resolve, reject) => {
      return axios.post(utils.apiUrl('room', 'approvalPlayer'),
        { roomId: this.selectedRoomId, playerName, socketId: this.socketService.socketId })
        .then((res) => {
          if (res.data.success && res.data.player) {
            this.currentPlayer = res.data.player;
            this.currentRoom = undefined;
            this.currentApproval = true;
            this.runUpdateCurrentData();
            resolve(res.data.success);
          }
          else if (res.data.error) {
            reject(res.data.error);
          }
        })
        .catch((err) => { reject(err); });
    });
  }

  async getRoom(id: string): Promise<Room> {
    let room: Room;
    await axios.post(utils.apiUrl('room', 'getRoomId'), { id })
      .then((res) => {
        room = res.data;
      });
    return room;
  }

  async getPlayer(id: string): Promise<Player> {
    let player: Player;
    await axios.post(utils.apiUrl('room', 'getPlayerId'), { id })
      .then((res) => {
        player = res.data;
      });
    return player;
  }

  userKnock(newPlayer: Player) {
    let subject = new Subject<boolean>();
    const modalRef = this.modalService.open(ModalComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.title = 'New user Knock 🚪';
    modalRef.componentInstance.content = newPlayer.name + ' wants to join the room !';
    modalRef.componentInstance.yes = 'Accept 🤗';
    modalRef.componentInstance.no = 'Refuse 💔';
    subject = modalRef.componentInstance.subject;
    return modalRef.result.then(response => {
      utils.log(`Pending changes accept user ${response}`);
      axios.post(utils.apiUrl('room', 'createPlayer'), { player: newPlayer, roomId: this.currentRoom.id, response })
        .then(res => {
          if (res.data.success) {
            this.toastService.createMessage('success', res.data.success);
          } else if (res.data.error) {
            this.toastService.createMessage('error', res.data.error);
          }
        })
        .catch(err => { this.toastService.createMessage('error', err); });
      return response;
    });
  }

}
