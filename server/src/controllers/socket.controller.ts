import * as utils from '../utils';
import * as roomCtrl from './room.controller';
import * as tetrisCtrl from './tetris.controller';
import { Player } from '../models/player.model';
import { Piece } from '../models/piece.model';

const socketController = (io) => {
    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);

        /**
         * Room controllers Functions :
         */

        socket.on('getPlayerIdList', async(data: { id: string, playersId: string[] }) => {
            return roomCtrl.getPlayerIds(data.playersId)
                .then((res: any) => {
                    io.to(data.id).emit('resGetPlayerIdList', { list: res });
                })
                .catch(err => { io.to(data.id).emit('resGetPlayerIdList', err); });
        });

        socket.on('createPlayer', async(data: { id: string, roomId: string, playerName: string }) => {
            return roomCtrl.createPlayer(data)
                .then((res: any) => {
                    io.emit('updatePlayer', { player: res.player, room: res.room });
                    io.emit('updateRoom', { room: res.room });

                    io.to(data.id).emit('resCreatePlayer', res);
                })
                .catch(err => { io.to(data.id).emit('resCreatePlayer', err); });
        });

        socket.on('testPlayer', async(data: { id: string, roomId: string, playerName: string }) => {
            return roomCtrl.testIfPlayerNameIsFree(data)
                .then(res => { io.to(data.id).emit('resTestPlayer', res); })
                .catch(err => { io.to(data.id).emit('resTestPlayer', err); });
        });

        socket.on('testRoom', async(data: { id: string, roomId: string }) => {
            if (data && data.id && data.roomId) {
                return roomCtrl.testIfRoomIdIsFree(data.roomId)
                    .then(res => { io.to(data.id).emit('resTestRoom', { isFree: res }); });
            }
        });

        socket.on('createRoom', async(data: { id: string, roomId: string, playerName: string, mode: number }) => {
            return roomCtrl.createRoom(data).then((res: any) => {
                io.emit('updatePlayer', { player: res.player, room: res.room });
                io.emit('updateRoom', { room: res.room });
                io.to(data.id).emit('resCreateRoom', { success: 'Room created successfully 😃', player: res.player, room: res.room });
            }).catch(err => { io.to(data.id).emit('resCreateRoom', err); });
        });

        socket.on('deletePlayer', async(data: { id: string }) => {
            if (data && data.id) {
                roomCtrl.deletePlayer(data.id)
                    .then((res: Piece[]) => { res.forEach(roomRes => { io.emit('updateRoom', { room: roomRes }); }); });
                io.emit('updateRoom');
            }
        });

        socket.on('getAllRooms', async(data) => {
            if (data && data.id)
                return roomCtrl.getAllRooms()
                    .then(res => {
                        io.to(data.id).emit('resGetAllRooms', { id: data.id, list: res });
                    }).catch(err => { utils.error(err); });
        });

        socket.on('getAllScores', async(data: { id: string }) => {
            if (data && data.id)
                return roomCtrl.getAllPlayerScores().then(res => {
                    io.to(data.id).emit('resGetAllScores', { id: data.id, list: res });
                }
                );
        });

        /**
         * Tetromino controllers Functions :
         */

        socket.on('updatePlayerServer', async(data: { player: Player, room: Piece }) => {
            tetrisCtrl.updatePlayerServer(data.player).then((res: { player: Player, room: Piece }) => {
                return io.emit('updatePlayer', res);
            }).catch(err => utils.error(err));
        });

        socket.on('updateRoomServer', async(room: Piece) => {
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
                                    io.emit('updatePlayerCurrent', { player: p, room: res.room });
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

        socket.on('newTetro', async(room: Piece) => {
            const currentRoomState = await roomCtrl.currentRoom(room.id);
            if (currentRoomState === undefined) {
                return io.emit('updateRoomAdmin', { error: 'Room id not found' });
            } else {
                tetrisCtrl.createTetromino(currentRoomState)
                    .then((res: any) => {
                        io.emit('updateTetris', { action: 'newTetro', room: currentRoomState, tetrominoList: res });
                    }).catch(err => {
                        io.emit('updateRoomAdmin', { room: currentRoomState, err });
                    });
            }
        });

        socket.on('disconnect', async(reason) => {
            utils.log(`${socket.id} disconnected because: ${reason}`);
            await roomCtrl.deletePlayer(socket.id)
                .then((res: Piece[]) => {
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