import * as utils from '../utils';
import * as roomCtrl from './room.controller';
import * as tetrisCtrl from './tetris.controller';
import { Room } from '../models/room.model';
import { Player } from '../models/player.model';

const socketController = (io) => {
    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);


        socket.on('updatePlayerServer', async(data: { player: Player, room: Room }) => {
            tetrisCtrl.updatePlayerServer(data.player).then((res: { player: Player, room: Room }) => {
                return io.emit('updatePlayer', res);
            }).catch(err => utils.error(err));
        });

        socket.on('updateRoomServer', async(room: Room) => {
            const currentRoomState = await roomCtrl.currentRoom(room.id);
            if (currentRoomState === undefined) {
                return io.emit('updateRoomAdmin', { error: 'Room id not found' });
            } else {
                if (currentRoomState.isPlaying !== true && room.isPlaying) {
                    // Start the game
                    tetrisCtrl.playGame(room.id)
                        .then((res: any) => {
                            if (res.room)
                                io.emit('updateRoom', { room: res.room });
                            if (res.playerList)
                                res.playerList.forEach(p => {
                                    io.emit('updatePlayer', { player: p, room: res.room });
                                });
                            io.emit('updateTetris', { action: 'play', room: res.room, tetrominoList: res.tetrominoList });
                        }).catch(err => {
                            io.emit('updateRoomAdmin', { err });
                        });
                } else if (currentRoomState.isPlaying && room.isPlaying
                    && currentRoomState.pause === false && room.pause) {
                    // Pause the game
                    tetrisCtrl.pauseGame(room.id)
                        .then((res: any) => {
                            if (res.room) {
                                io.emit('updateTetris', { action: 'pause', room: res.room });
                                io.emit('updateRoom', { room: res.room });
                            }
                        }).catch(err => {
                            io.emit('updateRoomAdmin', { err });
                        });
                } else if (currentRoomState.isPlaying && room.isPlaying
                    && currentRoomState.pause === true && room.pause !== true) {
                    // Resume the game
                    tetrisCtrl.resumeGame(room.id)
                        .then((res: any) => {
                            if (res.room) {
                                io.emit('updateTetris', { action: 'resume', room: res.room });
                                io.emit('updateRoom', { room: res.room });
                            }
                        }).catch(err => {
                            io.emit('updateRoomAdmin', { err });
                        });
                } else if (currentRoomState.isPlaying && room.isPlaying === false) {
                    // Reset game
                    tetrisCtrl.resetGame(room.id)
                        .then((res: any) => {
                            if (res.room) {
                                io.emit('updateTetris', { action: 'reset', room: res.room });
                                io.emit('updateRoom', { room: res.room });
                            }
                        }).catch(err => {
                            io.emit('updateRoomAdmin', { err });
                        });
                }
            }
        });

        socket.on('newTetro', async(room: Room) => {
            const currentRoomState = await roomCtrl.currentRoom(room.id);
            if (currentRoomState === undefined) {
                return io.emit('updateRoomAdmin', { error: 'Room id not found' });
            } else {
                tetrisCtrl.createTetromino()
                    .then((res: any) => {
                        io.emit('updateTetris', { action: 'newTetro', room: currentRoomState, tetrominoList: res });
                    }).catch(err => {
                        io.emit('updateRoomAdmin', { err });
                    });
            }
        });


        socket.on('disconnect', async(reason) => {
            utils.log(`${socket.id} disconnected because: ${reason}`);
            await roomCtrl.deletePlayer(socket.id)
                .then((res: Room[]) => {
                    res.forEach(resRoom => {
                        io.emit('updateRoom', { room: resRoom });
                    });
                }).catch((err) => {
                    utils.error(err);
                });
        });

    });
};

export default socketController;