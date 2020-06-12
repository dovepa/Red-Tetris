import { Injectable } from '@angular/core';
import { Room } from '../model/room.model';
import axios from 'axios';
import * as utils from '../utils';
import { ToastService } from './toast.service';
import { SocketService } from './socket.service';
import { Player } from '../model/player.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private readonly toastService: ToastService,
              private readonly socketService: SocketService) {
  }

  public selectedRoomId: string;
  public currentRoom: Room;
  public currentPlayer: Player;
  public currentWaitlisted: boolean;
  public currentApproval: boolean;

  private updateCurrentData = new Subject<any>();
  updateCurrentDataObs = this.updateCurrentData.asObservable();
  runUpdateCurrentData() {
    this.updateCurrentData.next();
  }

  resetAll() {
    this.selectedRoomId = undefined;
    this.currentRoom = undefined;
    this.currentPlayer = undefined;
    this.currentWaitlisted = undefined;
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



  testIfPlayerNameIsFree(playerName: string): Promise<boolean> {
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

}
