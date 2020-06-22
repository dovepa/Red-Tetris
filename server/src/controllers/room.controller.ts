import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { regex, log, error } from '../utils';
import { TetrisGrid } from '../models/tetrisGrid.model';

export const roomList: Room[] = [];
export const playerList: Player[] = [];

export const currentRoom = (roomId) => {
    const indexRoom = roomList.findIndex(room => { return (roomId === room.id && !room.isDeleted); });
    if (indexRoom === -1)
        return undefined;
    else
        return roomList[indexRoom];
};

export const getAllRooms = async(req, res) => {
    res.status(200).json(roomList.filter(r => { return r.isDeleted !== true; }));
};


export const getRoom = async(req, res) => {
    const id = req.body;
    if (!id)
        res.status(202).json({ error: 'Bad Request.' });
    roomList.forEach(room => {
        if (room.id === id && !room.isDeleted)
            return res.status(200).json(room);
    });
    res.status(202).json({ error: 'Room not found.' });
};

export const createRoom = async(req, res) => {
    const room = req.body;
    if (!room || !room.roomId || regex.test(room.roomId) === false || !room.mode
        || !room.playerName || regex.test(room.playerName) === false || !room.socketId)
        res.status(202).json({ error: 'Bad format room 😢' });
    else if (!roomList.filter(r => { return r.isDeleted !== true; }).every((r) => { return (r.id !== room.roomId && !room.isDeleted); }))
        res.status(202).json({ error: 'Room already exist 😢' });
    else {
        const newRoom = new Room(room.roomId, room.mode === 'solo' ? 0 : 1);
        newRoom.masterName = room.playerName;
        newRoom.masterId = room.socketId;
        newRoom.playersId = [room.socketId];
        roomList.push(newRoom);
        const newPlayer = new Player(newRoom.id, room.playerName, room.socketId);
        newPlayer.grid = new TetrisGrid(10, 20);
        newPlayer.score = 0;
        newPlayer.partWin = 0;
        newPlayer.tetrominoList = [];
        playerList.push(newPlayer);
        req.app.io.emit('updatePlayer', { player: newPlayer, room: newRoom });
        req.app.io.emit('updateRoom', { room: newRoom });
        res.status(200).json({ success: 'Room created successfully 😃', room: newRoom, player: newPlayer });
    }
};

export const getAllPlayerScores = async(req, res) => {
    return res.status(200).json(playerList);
};

export const testIfRoomIdIsFree = async(req, res) => {
    const data = req.body;
    let status = false;
    if (data.name)
        status = roomList.filter(r => { return r.isDeleted !== true; }).every((room) => { return (room.id !== data.name && !room.isDeleted); });
    res.status(200).json(status);
};

export const testIfPlayerNameIsFree = async(req, res) => {
    const data = req.body;
    let status = true;
    if (data.playerName) {
        const indexRoom = roomList.findIndex(room => { return (room.id === data.roomId && !room.isDeleted); });
        if (indexRoom === -1)
            return res.status(202).json({ error: 'Room not found 😢' });
        status = playerList.filter(p => { return p.isDeleted !== true; }).every(player => {
            if (regex.test(data.playerName) === false
                || roomList[indexRoom].playersId.includes(player.id)
                && data.playerName === player.name) {
                return false;
            } else {
                return true;
            }
        });
        res.status(200).json({ status, isPlaying: roomList[indexRoom].isPlaying });
    }
    else
        res.status(400);
};

export const createPlayer = async(req, res) => {
    const data = req.body;
    if (!data || !data.roomId || !data.playerName || !data.socketId)
        res.status(202).json({ error: 'Bad format 😢' });
    else {
        const indexRoom = roomList.findIndex(room => { return (room.id === data.roomId && !room.isDeleted); });
        if (indexRoom === -1)
            return res.status(202).json({ error: 'Room not found 😢' });
        const status = playerList.filter(p => { return p.isDeleted !== true; }).every(player => {
            if (roomList[indexRoom].playersId.includes(player.id) && data.playerName === player.name) {
                return false;
            } else {
                return true;
            }
        });
        if (status === true) {
            const newPlayer = new Player(data.roomId, data.playerName, data.socketId);
            newPlayer.grid = new TetrisGrid(10, 20);
            newPlayer.score = 0;
            newPlayer.partWin = 0;
            newPlayer.tetrominoList = [];
            roomList[indexRoom].playersId.push(newPlayer.id);
            playerList.push(newPlayer);
            req.app.io.emit('updatePlayer', { player: newPlayer, room: roomList[indexRoom] });
            req.app.io.emit('updateRoom', { room: roomList[indexRoom] });
            return res.status(200).json({ success: 'Player created successfully 😃', player: newPlayer, room: roomList[indexRoom] });
        } else {
            return res.status(202).json({ error: 'Sorry, player name already used. 😢' });
        }
    }
};

export const deletePlayer = (socketId: string) => {
    return new Promise((resolve, reject) => {
        const roomListTmp: Room[] = [];
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

export const getPlayerIds = async(req, res) => {
    const ids = req.body.ids;
    if (!ids)
        res.status(202).json({ error: 'Bad Request.' });
    const playerTmp: Player[] = [];
    ids.forEach(id => {
        playerList.forEach(player => {
            if (player.id === id && !player.isDeleted) {
                playerTmp.push(player);
            }
        });
    });
    if (playerTmp)
        return res.status(200).json(playerTmp);
    else
        return res.status(202).json({ error: 'Player not found.' });
};

export const deletePlayerId = async(req, res) => {
    const id = req.body.socketId;
    if (!id)
        res.status(202).json({ error: 'Bad Request.' });
    deletePlayer(id).then((response: Room[]) => {
        response.forEach(resRoom => {
            req.app.io.emit('updateRoom', { room: resRoom });
        });
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(202).json(err);
    });
};
