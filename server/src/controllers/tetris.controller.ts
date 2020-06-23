import { roomList, playerList } from './room.controller';
import { TetroMino } from '../models/tetromino.model';
import { Player } from '../models/player.model';
import { Game } from '../models/game.model';
import { Piece } from '../models/piece.model';

export const updatePlayerServer = (updatePlayer: Player) => {
    return new Promise((resolve, reject) => {
        const indexPlayer = playerList.findIndex(player => { return (player.id === updatePlayer.id && !player.isDeleted); });
        const indexRoom = roomList.findIndex(room => { return (updatePlayer.roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        if (indexPlayer === -1)
            reject({ error: 'No player found...' });

        playerList[indexPlayer].game = updatePlayer.game;
        playerList[indexPlayer].scores = updatePlayer.scores;
        resolve({ room: roomList[indexRoom], player: playerList[indexPlayer] });

    });
};


export const createTetromino = (room: Piece) => {
    return new Promise((resolve, reject) => {
        const tetrominoList: TetroMino[] = [];
        let i = 0;
        while (i < 14) {
            room.tetrominoList.push(new TetroMino());
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
            initPlayers(roomId).then(plTmp => {
                createTetromino(roomList[indexRoom]).then(tetro => {
                    resolve({ room: roomList[indexRoom], tetrominoList: tetro, playerList: plTmp });
                });
            });
        }
    });
};

export const initPlayers = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            const playerListTmp: Player[] = [];
            roomList[indexRoom].playersId.forEach(id => {
                const indexPlayer = playerList.findIndex(player => { return (player.id === id && !player.isDeleted); });
                if (indexPlayer !== -1) {
                    playerList[indexPlayer].game = new Game();
                    playerListTmp.push(playerList[indexPlayer]);
                }
            });
            resolve(playerListTmp);
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

export const resetGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...' });
        else {
            roomList[indexRoom].isPlaying = false;
            roomList[indexRoom].pause = false;
            resolve({ room: roomList[indexRoom] });
        }
    });
};