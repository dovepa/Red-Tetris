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
import { Router } from '@angular/router';
import { hashKey } from '../customUrlSerializer';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public selectedRoomId: string;
  public currentRoom: Room;
  public currentPlayer: Player;

  constructor(private readonly toastService: ToastService,
              private readonly socketService: SocketService,
              private modalService: NgbModal,
              private router: Router,
              private readonly socket: Socket) {

    this.socket.on('updatePlayer', data => {
      if (this.currentPlayer && this.currentPlayer.id
        && data && data.player && data.player.id && data.player.id === this.currentPlayer.id) {
        utils.log('Socket :: updatePlayer service', data, this.currentPlayer);
        this.currentPlayer = data.player;
        this.runUpdateCurrentData();
      }
    });

    this.socket.on('updateRoom', data => {
      if (data && data.room && data.room.id && this.currentRoom
        && this.currentRoom.id && data.room.id === this.currentRoom.id) {
        utils.log('Socket :: updateRoom service', data, this.currentRoom);
        this.currentRoom = data.room;
        this.runUpdateCurrentData();
      }
    });
  }

  private updateCurrentData = new Subject<any>();
  updateCurrentDataObs = this.updateCurrentData.asObservable();
  runUpdateCurrentData() {
    this.updateCurrentData.next();
  }

  goToGame() {
    this.router.navigate([`${hashKey}${this.currentRoom.id}[${this.currentPlayer.name}]`]);
  }

  resetAll() {
    this.selectedRoomId = undefined;
    this.currentRoom = undefined;
    this.currentPlayer = undefined;
    this.runUpdateCurrentData();
  }

  async testIfRoomIdIsFree(name: string): Promise<boolean> {
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

  createRoom(roomId, playerName, mode): Promise<string> {
    return new Promise((resolve, reject) => {
      return axios.post(utils.apiUrl('room', 'createRoom'), { roomId, playerName, mode, socketId: this.socketService.socketId })
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

    return modalRef.result.then(async response => {
      utils.log(`Pending changes accept user ${response}`);
      await axios.post(utils.apiUrl('room', 'createPlayer'), { player: newPlayer, roomId: this.currentRoom.id, response })
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

  async getPlayerList(id: string): Promise<Player[]> {
    let room: [];
    await axios.post(utils.apiUrl('room', 'getRoomId'), { id })
      .then((res) => {
        room = res.data;
      });
    return room;
  }

}
