import * as Router from 'koa-router';
import * as ctrl from '../controllers/room.controller';
const router = new Router({ prefix: '/api/room' });

router.get('/', async(ctx, next) => {
    ctx.body = 'room';
});

router.get('/createRoom', ctrl.createRoom);

export default router;