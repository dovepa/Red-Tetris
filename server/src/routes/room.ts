import * as express from 'express';
import * as ctrl from '../controllers/room.controller';
const roomRoute = express.Router();

roomRoute.route('/getAll/').get(ctrl.getAllRooms);
roomRoute.route('/test/').post(ctrl.testIfRoomNameIsFree);
roomRoute.route('/getRoom/').post(ctrl.getRoom);
roomRoute.route('/create/').post(ctrl.createRoom);

export default roomRoute;