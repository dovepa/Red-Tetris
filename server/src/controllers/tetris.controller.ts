import { roomList, playerList } from './room.controller';
import { TetroMino } from '../models/tetromino.model';
import { Player } from '../models/player.model';

export const createTetromino = () => {
    return new Promise((resolve, reject) => {
        const tetrominoList: TetroMino[] = [];
        let i = 0;
        while (i < 14) {
            tetrominoList.push(new TetroMino());
            i++;
        }
        resolve(tetrominoList);
    });
};

export const playGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            roomList[indexRoom].isPlaying = true;
            createTetromino().then(tetro => {
                resolve({ room: roomList[indexRoom], tetrominoList: tetro });
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