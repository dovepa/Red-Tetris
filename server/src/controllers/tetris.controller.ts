import { roomList, playerList } from './room.controller';
import { TetroMino } from '../models/tetromino.model';
import { Player } from '../models/player.model';

export const createTetromino = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            const tetrominoList: TetroMino[] = [];
            const players: Player[] = [];
            let i = 0;
            while (i < 7) {
                tetrominoList.push(new TetroMino());
                i++;
            }
            roomList[indexRoom].playersId.forEach((id) => {
                const indexPlayer = playerList.findIndex((player) => { return player.id === id; });
                if (indexPlayer !== -1) {
                    playerList[indexPlayer].tetrominoList = tetrominoList;
                    players.push(playerList[indexPlayer]);
                }
            });
            resolve(players);
        }
    });
};

export const playGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            roomList[indexRoom].isPlaying = true;
            createTetromino(roomId).then(players => {
                resolve({ room: roomList[indexRoom], playerList: players });
            });
        }
    });
};

export const pauseGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            roomList[indexRoom].pause = true;
            resolve({ room: roomList[indexRoom] });
        }
    });
};

export const resumeGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            roomList[indexRoom].pause = false;
            resolve({ room: roomList[indexRoom] });
        }
    });
};