import { Room } from '../models/room.model';

const roomList: Room[] = [];

export const getAllRooms = async(req, res) => {
    roomList.push(new Room('ssss', 0));
    roomList.push(new Room('aaa', 0));
    roomList.push(new Room('bbb', 1));
    res.status(200).json(roomList);
};

export const testIfRoomNameIsFree = async(req, res) => {
    const data = req.body;
    let status = false;
    if (data.name)
        status = roomList.every((room) => { return room.roomName !== data.name; });
    res.status(200).json(status);
};

export const createRoom = async(req, res) => {
    res.status(200).json(roomList);
};
