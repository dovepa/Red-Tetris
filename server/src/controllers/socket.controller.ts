import * as utils from '../utils';
import * as roomCtrl from './room.controller';

const socketController = (io) => {
    io.emit('userKnockSuccess', { error: 'sdfsfsf' });
    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);

        socket.on('disconnect', reason => {
            socket.emit('userDisconnect', socket.id);
            utils.log(`${socket.id} disconnected because: ${reason}`);
        });
    });
};

export default socketController;