import * as Router from 'koa-router';
import * as ctrl from '../controllers/tetris.controller';

const router = new Router({ prefix: '/api/tetris' });

router.get('/', async(ctx, next) => {
    ctx.body = 'tetris';
});

router.get('/createRoom', ctrl.newTetri);

export default router;