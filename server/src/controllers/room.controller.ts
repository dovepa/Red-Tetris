import { Room } from '../models/room.model';

const roomList: Room[] = [];

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
        res.status(400).json({ error: 'Bad Request.' });
    roomList.forEach(room => {
        if (room.roomId === id)
            return res.status(200).json(room);
    });
    res.status(409).json({ error: 'Room not found.' });
};

export const createRoom = async(req, res) => {
    const room = req.body.room;
    if (!room || !room.roomName || !room.mode)
        res.status(400).json({ error: 'Bad Request.' });
    else if (!roomList.every((r) => { return r.roomName !== room.roomName; }))
        res.status(409).json({ error: 'Sorry, this name is already taken. Try another ?' });
    else {
        roomList.push(new Room(room.roomName, room.mode));
        res.status(200).json({ success: true });
    }
};
