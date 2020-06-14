import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { PlayerScore } from '../models/score.model';
import { regex } from '../utils';

const roomList: Room[] = [];
const playerList: Player[] = [];
const playerScore: PlayerScore[] = [];

export const getAllRooms = async(req, res) => {
    res.status(200).json(roomList);
};

export const testIfRoomIdIsFree = async(req, res) => {
    const data = req.body;
    let status = false;
    if (data.name)
        status = roomList.every((room) => { return room.id !== data.name; });
    res.status(200).json(status);
};

export const getRoom = async(req, res) => {
    const id = req.body;
    if (!id)
        res.status(202).json({ error: 'Bad Request.' });
    roomList.forEach(room => {
        if (room.id === id)
            return res.status(200).json(room);
    });
    res.status(202).json({ error: 'Room not found.' });
};

export const createRoom = async(req, res) => {
    req.app.io.emit('updateRoom', {});

    const room = req.body;
    if (!room || !room.roomId || regex.test(room.roomId) === false || !room.mode
        || !room.playerName || regex.test(room.playerName) === false || !room.socketId)
        res.status(202).json({ error: 'Bad format room 😢' });
    else if (!roomList.every((r) => { return r.id !== room.roomId; }))
        res.status(202).json({ error: 'Room already exist 😢' });
    else {
        const newRoom = new Room(room.roomId, room.mode === 'solo' ? 0 : 1);
        newRoom.masterName = room.playerName;
        newRoom.masterId = room.socketId;
        newRoom.playersId = [room.socketId];
        roomList.push(newRoom);
        const newPlayer = new Player(newRoom.id, room.playerName, room.socketId);
        newPlayer.approval = true;
        playerList.push(newPlayer);
        req.app.io.emit('updateRoom', { room: newRoom });
        res.status(200).json({ success: 'Room created successfully 😃', room: newRoom, player: newPlayer });
    }
};

export const testIfPlayerNameIsFree = async(req, res) => {
    const data = req.body;
    let status = true;
    if (data.playerName) {
        const roomIndex = roomList.findIndex(room => { return room.id === data.roomId; });
        if (roomIndex === -1)
            return res.status(202).json({ error: 'Room not found 😢' });
        status = playerList.every(player => {
            if (regex.test(data.playerName) === false || roomList[roomIndex].playersId.includes(player.id) && data.playerName === player.name) {
                return false;
            } else {
                return true;
            }
        });
        res.status(200).json({ status, isPlaying: roomList[roomIndex].isPlaying });
    }
    else
        res.status(400);
};

export const approvalPlayer = async(req, res) => {
    const data = req.body;
    if (!data || !data.roomId || !data.playerName || !data.socketId)
        res.status(202).json({ error: 'Bad format 😢' });
    else {
        const roomIndex = roomList.findIndex(room => { return room.id === data.roomId; });
        if (roomIndex === -1)
            return res.status(202).json({ error: 'Room not found 😢' });
        const status = playerList.every(player => {
            if (roomList[roomIndex].playersId.includes(player.id) && data.playerName === player.name) {
                return false;
            } else {
                return true;
            }
        });
        if (status === true) {
            const newPlayer = new Player(data.roomId, data.playerName, data.socketId);
            newPlayer.approval = false;
            req.app.io.emit('userKnock', { roomId: data.roomId, player: newPlayer });
            return res.status(200).json({ success: 'Knock created successfully 😃', player: newPlayer });
        } else {
            return res.status(202).json({ error: 'Sorry, player name already used. 😢' });
        }
    }
};

export const createPlayer = async(req, res) => {
    const data = req.body;
    if (!data || !data.player || !data.roomId) {
        req.app.io.emit('userKnockSuccess', { room: data.player.roomId, player: data.player, error: 'Bad format 😢' });
        return res.status(202).json({ error: 'Bad Request.' });
    } else if (data.response === false) {
        req.app.io.emit('userKnockSuccess', { room: data.player.roomId, player: data.player, error: 'The roomMaster not accept you 😢' });
        return res.status(202);
    } else {
        const roomIndex = roomList.findIndex(room => { return room.id === data.roomId; });
        if (roomIndex === -1) {
            req.app.io.emit('userKnockSuccess', { room: data.player.roomId, player: data.player, error: 'Room not found 😢' });
            return res.status(202);
        }
        const newPlayer = new Player(data.roomId, data.player.name, data.player.id);
        newPlayer.approval = true;
        roomList[roomIndex].playersId.push(newPlayer.id);
        playerList.push(newPlayer);
        req.app.io.emit('userKnockSuccess', { room: roomList[roomIndex], player: newPlayer, success: 'RoomMaster let you enter 🤠' });
        req.app.io.emit('updatePlayer', { player: newPlayer });
        req.app.io.emit('updateRoom', { room: roomList[roomIndex] });
    }
    return res.status(200);
};

export const deletePlayer = (socketId: string) => {
    return new Promise((resolve, reject) => {
        if (!socketId)
            reject('No socket Id');
        let editRoom: Room;
        playerList.forEach((player, indexPlayer) => {
            if (player.id === socketId) {
                roomList.forEach((room, indexRoom) => {
                    if (room.id === player.roomId) {
                        if (room.playersId.includes(socketId))
                            room.playersId.splice(room.playersId.indexOf(socketId), 1);
                        if (room.playersId.length > 0) {
                            if (room.masterId === socketId) {
                                // change master
                                room.masterId = room.playersId[0];
                                playerList.forEach(newMaster => {
                                    if (newMaster.id === room.playersId[0])
                                        room.masterName = newMaster.name;
                                });
                            }
                            editRoom = room;
                        }
                        else {
                            // delete room
                            roomList.splice(indexRoom, 1);
                        }
                    }
                });
                playerList.slice(indexPlayer, 1);
                resolve(editRoom);
            }
        });
    });
};

export const disconnectPlayer = async(req, res) => {
    res.status(200).json();
    req.app.io.emit('disconnectPlayer');
};

export const getPlayer = async(req, res) => {
    const data = req.body;
    if (!data.id)
        res.status(202).json({ error: 'Bad Request.' });
    playerList.forEach(player => {
        if (player.id === data.id) {
            return res.status(200).json(player);
        }
    });
    res.status(202).json({ error: 'Player not found.' });
};

export const getAllPlayerScores = async(req, res) => {
    res.status(200).json(playerScore);
};
