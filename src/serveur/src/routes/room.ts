import * as Router from 'koa-router';
const router = new Router({ prefix: '/api/room' });

router.get('/', async(ctx, next) => {
    ctx.body = 'room';
});

export default router;