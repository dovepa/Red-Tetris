import * as utils from '../utils';
import * as roomCtrl from './room.controller';

const socketController = (io) => {
    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);

        socket.on('disconnect', async(reason) => {
            utils.log(`${socket.id} disconnected because: ${reason}`);
            await roomCtrl.deletePlayer(socket.id)
                .then((editRoom) => { io.emit('updateRoom', { room: editRoom }); })
                .catch((err) => { utils.error(err); });
        });

    });
};

export default socketController;