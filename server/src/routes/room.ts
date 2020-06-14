import * as express from 'express';
import * as ctrl from '../controllers/room.controller';
const roomRoute = express.Router();

roomRoute.route('/getAllRooms/').get(ctrl.getAllRooms);
roomRoute.route('/getRoomId/').post(ctrl.getRoom);
roomRoute.route('/testRoom/').post(ctrl.testIfRoomIdIsFree);
roomRoute.route('/createRoom/').post(ctrl.createRoom);

roomRoute.route('/approvalPlayer/').post(ctrl.approvalPlayer);
roomRoute.route('/createPlayer/').post(ctrl.createPlayer);
roomRoute.route('/testPlayer/').post(ctrl.testIfPlayerNameIsFree);
roomRoute.route('/disconnectPlayer/').post(ctrl.disconnectPlayer);
roomRoute.route('/getPlayerId/').post(ctrl.getPlayer);

roomRoute.route('/getAllScores/').get(ctrl.getAllPlayerScores);


export default roomRoute;