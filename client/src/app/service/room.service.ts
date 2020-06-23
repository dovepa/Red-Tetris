import { Injectable } from '@angular/core';
import axios from 'axios';
import * as utils from '../utils';
import { ToastService } from './toast.service';
import { SocketService } from './socket.service';
import { Player, Score } from '../model/player.model';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { hashKey } from '../customUrlSerializer';
import { Piece } from '../model/piece.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private readonly toastService: ToastService,
    private readonly socketService: SocketService,
    private modalService: NgbModal,
    private router: Router,
    private readonly socket: Socket) {

    this.socket.on('updatePlayer', async (data) => {
      if (data && data.player && data.player.id) {
        if (this.currentRoom && this.currentPlayerList && this.currentRoom.id && this.currentRoom.playersId
          && this.currentRoom.playersId.includes(data.player.id)) {
          const index = this.currentPlayerList.findIndex(player => player.id === data.player.id);
          if (index === -1) {
            utils.error('No player index...', data.player);
          } else {
            this.currentPlayerList[index] = data.player;
          }
        }
        if (this.currentPlayer && this.currentPlayer.id
          && data.player.id === this.currentPlayer.id) {
          utils.log('Socket :: updatePlayer service', data, this.currentPlayer);
          this.currentPlayer = data.player;
        }
      }
    });

    this.socket.on('updateRoom', async (data) => {
      if (data && data.room && data.room.id
        && this.currentRoom && this.currentRoom.id
        && data.room.isDeleted !== true
        && data.room.id === this.currentRoom.id) {
        utils.log('Socket :: updateRoom service', data, this.currentRoom);
        this.currentRoom = data.room;
        this.populatePlayerList();
      }
    });

    this.socket.on('updateRoomAdmin', async (data) => {
      if (data && data.roomId && !data.room.isDeleted && this.currentRoom
        && this.currentRoom.id && data.roomId === this.currentRoom.id) {
        if (this.currentPlayer.id === this.currentRoom.masterId) {
          if (data.error) {
            this.toastService.createMessage('error', data.error);
          }
          if (data.success) {
            this.toastService.createMessage('success', data.success);
          }
        }
      }
    });
  }
  public selectedRoomId: string;
  public currentRoom: Piece;
  public currentPlayer: Player;
  public currentPlayerList: Player[];

  async populatePlayerList() {
    this.currentPlayerList = [];
    return this.getPlayerList().then(res => {
      this.currentPlayerList = res;
      if (this.currentRoom) {
        this.currentPlayerList.forEach(p => {
          if (p.game.isWinner) {
            this.currentRoom.isPlaying = false;
            this.editRoomAdmin();
          }
        });
      }
    });
  }

  getPlayerList(): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      return axios.post(utils.apiUrl('room', 'getPlayerIdList'), { ids: this.currentRoom.playersId })
        .then((res) => {
          let scores: Player[] = [];
          scores = res.data;
          if (scores) {
            scores.sort((a, b) => b.game.score - a.game.score);
          }
          resolve(scores);
        });
    });
  }



  goToGame() {
    this.currentPlayerList = [];
    this.router.navigate([`${hashKey}${this.currentRoom.id}[${this.currentPlayer.name}]`]);
  }

  async resetAll() {
    utils.log('Reset all', this.currentPlayer, this.socketService.socketId);
    if (this.currentPlayer) {
      await axios.post(utils.apiUrl('room', 'deletePlayer'), { socketId: this.currentPlayer.id })
        .then((res) => {
          if (res.data.error) {
            utils.error(res.data.error);
          } else {
            utils.log('reset all res', res.data);
          }
        })
        .catch((err) => { utils.error(err); });
    }
    this.selectedRoomId = undefined;
    this.currentRoom = undefined;
    this.currentPlayer = undefined;
  }


  editRoomAdmin() {
    this.socket.emit('updateRoomServer', this.currentRoom);
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



  async getAllRooms(): Promise<Piece[]> {
    let list: Piece[] = [];
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
        .then(async (res) => {
          if (res.data.success) {
            this.currentPlayer = res.data.player;
            this.currentRoom = res.data.room;
            this.populatePlayerList();
            this.selectedRoomId = undefined;
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
      return axios.post(utils.apiUrl('room', 'createPlayer'),
        { roomId: this.selectedRoomId, playerName, socketId: this.socketService.socketId })
        .then(async (res) => {
          if (res.data.success && res.data.player) {
            this.currentPlayer = res.data.player;
            this.currentRoom = res.data.room;
            this.populatePlayerList();
            this.selectedRoomId = undefined;
            resolve(res.data.success);
          }
          else if (res.data.error) {
            reject(res.data.error);
          }
        })
        .catch((err) => { reject(err); });
    });
  }

  async getRoom(id: string): Promise<Piece> {
    let room: Piece;
    await axios.post(utils.apiUrl('room', 'getRoomId'), { id })
      .then((res) => {
        room = res.data;
      });
    return room;
  }

  getPlayerListScore(): Promise<Score[]> {
    return new Promise((resolve, reject) => {
      return axios.get(utils.apiUrl('room', 'getAllScores'))
        .then((res: any) => {
          const scoreList: Score[] = [];
          if (res && res.data) {
            res.data.forEach((player: Player) => {
              if (player.scores) {
                player.scores.forEach(scoreInfo => {
                  scoreList.push({ name: player.name, roomId: player.roomId, score: scoreInfo.score, date: scoreInfo.date });
                });
              }
            });
          }
          scoreList.sort((a, b) => b.score - a.score);
          resolve(scoreList);
        });
    });
  }
}
