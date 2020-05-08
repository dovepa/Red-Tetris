import * as utils from '../utils';

const socketController = (io) => {

    io.on('connection', socket => {
        utils.log(`new connection: ${socket.id}`);

        socket.on('disconnect', reason => {
            utils.log(`${socket.id} disconnected because: ${reason}`);
        });
    });
};

export default socketController;