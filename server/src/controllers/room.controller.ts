import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { PlayerScore } from '../models/score.model';

const roomList: Room[] = [];
const playerList: Player[] = [];
const playerScore: PlayerScore[] = [];

export const getAllRooms = async(req, res) => {
    res.status(200).json(roomList);
};

export const testIfRoomNameIsFree = async(req, res) => {
    const data = req.body;
    let status = false;
    if (data.name)
        status = roomList.every((room) => { return room.roomName !== data.name; });
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
    const room = req.body;
    if (!room || !room.roomName || !room.mode || !room.playerName || !room.socketId)
        res.status(202).json({ success: 'Bad format room 😢' });
    else if (!roomList.every((r) => { return r.roomName !== room.roomName; }))
        res.status(202).json({ error: 'Room already exist 😢' });
    else {
        const newRoom = new Room(room.roomName, room.mode === 'solo' ? 0 : 1);
        newRoom.masterName = room.playerName;
        newRoom.masterId = room.socketId;
        newRoom.playersId = [room.socketId];
        roomList.push(newRoom);
        const newPlayer = new Player(newRoom.id, room.playerName, room.socketId);
        playerList.push(newPlayer);
        res.status(200).json({ success: 'Room created successfully 😃', room: newRoom, player: newPlayer });
        req.app.io.emit('roomUpdate');
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
            if (roomList[roomIndex].playersId.includes(player.id) && data.playerName === player.name) {
                return false;
            } else {
                return true;
            }
        });
        res.status(200).json(status);
    }
    else
        res.status(400);
};

export const createPlayer = async(req, res) => {

    const room = req.body;
    req.app.io.emit('playerUpdate', room);
    if (!room || !room.roomName || !room.mode || !room.playerName || !room.socketId)
        res.status(202).json({ success: 'Bad format room 😢' });
    else if (!roomList.every((r) => { return r.roomName !== room.roomName; }))
        res.status(202).json({ error: 'Room already exist 😢' });
    else {
        const newRoom = new Room(room.roomName, room.mode === 'solo' ? 0 : 1);
        newRoom.masterId = room.socketId;
        newRoom.masterName = room.playerName;
        roomList.push(newRoom);
        res.status(200).json({ success: 'Room created successfully 😃' });
        req.app.io.emit('playerUpdate');
    }
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
