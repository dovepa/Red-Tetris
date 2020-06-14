import * as utils from '../utils';
import * as roomCtrl from './room.controller';

const socketController = (io) => {
    io.emit('userKnockSuccess', { error: 'sdfsfsf' });
    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);

        socket.on('playerLeave', ((socketId) => {
            return roomCtrl.deletePlayer(socketId)
                .then((res: any) => { io.emit('updateRoom', { room: res.room }); })
                .catch((err) => { utils.error(err); });
        }));

        socket.on('disconnect', reason => {
            utils.log(`${socket.id} disconnected because: ${reason}`);
        });
    });
};

export default socketController;