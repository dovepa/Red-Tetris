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

    this.socket.on('updatePlayer', async (data: { room: Piece, player: Player }) => {
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
      }
    });

    this.socket.on('updatePlayerCurrent', async (data: { room: Piece, player: Player }) => {
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
        this.socket.emit('getPlayerIdList', { id: this.socketService.socketId, playersId: this.currentRoom.playersId });
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

    this.socket.on('resCreateRoom', async (data) => {
      if (data && data.success) {
        this.currentPlayer = data.player;
        this.currentRoom = data.room;
        this.socket.emit('getPlayerIdList', { id: this.socketService.socketId, playersId: this.currentRoom.playersId });
        this.selectedRoomId = undefined;
        this.toastService.createMessage('success', data.success);
        this.goToGame();
      }
    });

    this.socket.on('resCreatePlayer', async (data) => {
      if (data.success && data.player) {
        this.currentPlayer = data.player;
        this.currentRoom = data.room;
        this.socket.emit('getPlayerIdList', { id: this.socketService.socketId, playersId: this.currentRoom.playersId });
        this.selectedRoomId = undefined;
        this.toastService.createMessage('success', data.success);
        this.goToGame();
      }
    });



    this.socket.on('resGetPlayerIdList', async (data) => {
      if (data && data.list) {
        this.currentPlayerList = [];
        let scores: Player[] = [];
        scores = data.list;
        if (scores) {
          scores.sort((a, b) => b.game.score - a.game.score);
        }
        this.currentPlayerList = scores;
        if (this.currentRoom) {
          this.currentPlayerList.forEach(p => {
            if (p.game.isWinner) {
              this.currentRoom.isPlaying = false;
              this.editRoomAdmin();
            }
          });
        }
      }
    });



  }

  public selectedRoomId: string;
  public currentRoom: Piece;
  public currentPlayer: Player;
  public currentPlayerList: Player[];



  goToGame() {
    this.currentPlayerList = [];
    this.router.navigate([`${hashKey}${this.currentRoom.id}[${this.currentPlayer.name}]`]);
  }

  async resetAll() {
    utils.log('Reset all', this.currentPlayer, this.socketService.socketId);
    if (this.currentPlayer) {
      this.socket.emit('deletePlayer', { id: this.currentPlayer.id });
      this.selectedRoomId = undefined;
      this.currentRoom = undefined;
      this.currentPlayer = undefined;
    }
  }

  editRoomAdmin() {
    this.socket.emit('updateRoomServer', this.currentRoom);
  }


}
