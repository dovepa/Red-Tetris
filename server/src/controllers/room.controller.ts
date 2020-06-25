import { Player } from '../models/player.model';
import { regex, log, error } from '../utils';
import { Piece } from '../models/piece.model';
import { Game } from '../models/game.model';

export const roomList: Piece[] = [];
export const playerList: Player[] = [];



export const testIfRoomIdIsFree = async(roomId) => {
    return new Promise((resolve, reject) => {
        let status = false;
        if (roomId)
            status = roomList.filter(r => { return r.isDeleted !== true; }).every((room) => { return (room.id !== roomId && !room.isDeleted); });
        resolve(status);
    });
};

export const testIfPlayerNameIsFree = (data) => {
    return new Promise((resolve, reject) => {
        let status = true;
        if (data.playerName) {
            const indexRoom = roomList.findIndex(room => { return (room.id === data.roomId && !room.isDeleted); });
            if (indexRoom === -1)
                return reject({ error: 'Room not found 😢' });
            status = playerList.filter(p => { return p.isDeleted !== true; }).every(player => {
                if (regex.test(data.playerName) === false
                    || roomList[indexRoom].playersId.includes(player.id)
                    && data.playerName === player.name) {
                    return false;
                } else {
                    return true;
                }
            });
            resolve({ status, isPlaying: roomList[indexRoom].isPlaying });
        }
    });
};

export const createPlayer = async(data) => {
    return new Promise((resolve, reject) => {
        if (!data || !data.roomId || !data.playerName || !data.id)
            reject({ error: 'Bad format 😢' });
        else {
            const indexRoom = roomList.findIndex(room => { return (room.id === data.roomId && !room.isDeleted); });
            if (indexRoom === -1)
                reject({ error: 'Room not found 😢' });
            const status = playerList.filter(p => { return p.isDeleted !== true; }).every(player => {
                if (roomList[indexRoom].playersId.includes(player.id) && data.playerName === player.name) {
                    return false;
                } else {
                    return true;
                }
            });
            if (status === true) {
                const newPlayer = new Player(data.roomId, data.playerName, data.id);
                roomList[indexRoom].playersId.push(newPlayer.id);
                playerList.push(newPlayer);
                return resolve({ success: 'Player created successfully 😃', player: newPlayer, room: roomList[indexRoom] });
            } else {
                return reject({ error: 'Sorry, player name already used. 😢' });
            }
        }
    });
};


export const getPlayerIds = async(ids) => {
    return new Promise((resolve, reject) => {
        if (!ids)
            reject({ error: 'Bad Request.' });
        const playerTmp: Player[] = [];
        ids.forEach(id => {
            playerList.forEach(player => {
                if (player.id === id && !player.isDeleted) {
                    playerTmp.push(player);
                }
            });
        });
        if (playerTmp)
            return resolve(playerTmp);
        else
            return resolve({ error: 'Player not found.' });
    });

};

export const deletePlayerId = async(req, res) => {
    return new Promise((resolve, reject) => {
        const id = req.body.socketId;
        if (!id)
            res.status(202).json({ error: 'Bad Request.' });
        deletePlayer(id).then((response: Piece[]) => {
            response.forEach(resRoom => {
                req.app.io.emit('updateRoom', { room: resRoom });
            });
            return res.status(200).json(response);
        }).catch(err => {
            return res.status(202).json(err);
        });
    });

};

// get all players score
export const getAllPlayerScores = () => {
    return new Promise((resolve, reject) => {
        return resolve(playerList);
    });
};

// Delete Player by socket
export const deletePlayer = (socketId: string) => {
    return new Promise((resolve, reject) => {
        const roomListTmp: Piece[] = [];
        if (!socketId)
            reject('No socket Id');
        const indexPlayer = playerList.findIndex(player => { return (!player.isDeleted && player.id === socketId); });
        if (indexPlayer !== -1) {
            const indexRoom = roomList.findIndex(room => { return (room.id === playerList[indexPlayer].roomId && !room.isDeleted); });
            if (indexRoom === -1)
                reject(`no room for player ${playerList[indexPlayer]}`);
            else {
                if (roomList[indexRoom].playersId.includes(socketId))
                    roomList[indexRoom].playersId.splice(roomList[indexRoom].playersId.indexOf(socketId), 1);
                if (roomList[indexRoom].playersId.length > 0) {
                    if (roomList[indexRoom].masterId === socketId) {
                        // change master
                        roomList[indexRoom].masterId = roomList[indexRoom].playersId[0];
                        playerList.forEach(newMaster => {
                            if (newMaster.id === roomList[indexRoom].playersId[0])
                                roomList[indexRoom].masterName = newMaster.name;
                        });
                    }
                    playerList[indexPlayer].isDeleted = true; // delete player
                    if (roomList[indexRoom].isPlaying && !playerList[indexPlayer].game.endGame) {
                        const playersTmp: Player[] = [];
                        roomList[indexRoom].playersId.forEach(id => {
                            const indexPlayerTmp = playerList.findIndex(player => { return (!player.isDeleted && player.id === id); });
                            playersTmp.push(playerList[indexPlayerTmp]);
                        });
                        const lastPlayer = playersTmp.every(p => {
                            if (p.id !== socketId) {
                                return (p.game.isPlaying === false && p.game.endGame === true);
                            }
                            else {
                                return true;
                            }
                        });
                        if (lastPlayer) {
                            playersTmp.sort((a, b) => { return b.game.date - a.game.date; });
                            if (playersTmp[0])
                                playersTmp[0].game.isWinner = true;
                        }
                    }
                }
                else {
                    playerList[indexPlayer].isDeleted = true; // delete player
                    roomList[indexRoom].isDeleted = true; // delete room
                }
                roomListTmp.push(roomList[indexRoom]);
            }
        } else {
            roomList.forEach(room => {
                if (room.playersId.includes(socketId)) {
                    room.playersId.splice(room.playersId.indexOf(socketId), 1);
                    if (room.playersId.length === 0)
                        room.isDeleted = true;
                    roomListTmp.push(room);
                }
            });
        }
        resolve(roomListTmp);
    });
};

// Get current Room for diff state
export const currentRoom = (roomId) => {
    const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
    if (indexRoom === -1)
        return undefined;
    else
        return roomList[indexRoom];
};

// Get all rooms list
export const getAllRooms = () => {
    return new Promise((resolve, reject) => {
        resolve(roomList.filter(r => { return r.isDeleted !== true; }));
    });
};

// create a new room
export const createRoom = async(room) => {
    return new Promise((resolve, reject) => {
        if (!room || !room.roomId || regex.test(room.roomId) === false || !room.mode
            || !room.playerName || regex.test(room.playerName) === false || !room.id)
            reject({ error: 'Bad format room 😢' });
        else if (!roomList.filter(r => { return r.isDeleted !== true; }).every((r) => { return (r.id !== room.roomId && !room.isDeleted); }))
            reject({ error: 'Room already exist 😢' });
        else {
            const newRoom = new Piece(room.roomId, room.mode === 'solo' ? 0 : 1);
            newRoom.masterName = room.playerName;
            newRoom.masterId = room.id;
            newRoom.playersId = [room.id];
            newRoom.pause = false;
            newRoom.isPlaying = false;
            roomList.push(newRoom);
            const newPlayer = new Player(newRoom.id, room.playerName, room.id);
            playerList.push(newPlayer);
            resolve({ success: 'Room created successfully 😃', room: newRoom, player: newPlayer });
        }
    });
};

