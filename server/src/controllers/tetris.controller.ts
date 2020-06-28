import { roomList, playerList } from './room.controller';
import { TetroMino } from '../models/tetromino.model';
import { Player } from '../models/player.model';
import { Game } from '../models/game.model';
import { Piece } from '../models/piece.model';

// Update Server for player data
export const updatePlayerServer = (updatePlayer: Player) => {
    return new Promise((resolve, reject) => {
        const indexPlayer = playerList.findIndex(player => { return (player.id === updatePlayer.id && !player.isDeleted); });
        const indexRoom = roomList.findIndex(room => { return (updatePlayer.roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...', num: 1 });
        if (indexPlayer === -1)
            reject({ error: 'No player found...' });

        playerList[indexPlayer].scores = updatePlayer.scores;
        playerList[indexPlayer].game = updatePlayer.game;
        resolve({ room: roomList[indexRoom], player: playerList[indexPlayer] });
    });
};

// create a new tetromino list for room
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

// Set room to play
export const playGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...', num: 2 });
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

// Init player for a new game
export const initPlayers = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...', num: 3 });
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

// Pause game
export const pauseGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...', num: 4 });
        else {
            roomList[indexRoom].pause = true;
            resolve({ room: roomList[indexRoom] });
        }
    });
};

// Resume game
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

// Reset game for players
export const resetGame = (roomId) => {
    return new Promise((resolve, reject) => {
        const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
        if (indexRoom === -1)
            reject({ error: 'No room found...', num: 5 });
        else {
            roomList[indexRoom].isPlaying = false;
            roomList[indexRoom].pause = false;
            resolve({ room: roomList[indexRoom] });
        }
    });
};