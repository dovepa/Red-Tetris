import * as Router from 'koa-router';
const router = new Router({ prefix: '/api/tetris' });

router.get('/', async(ctx, next) => {
    ctx.body = 'tetris';
});

export default router;