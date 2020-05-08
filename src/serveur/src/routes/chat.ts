import * as Router from 'koa-router';
const router = new Router({ prefix: '/api/chat' });

router.get('/', async(ctx, next) => {
    ctx.body = 'chat';
});

export default router;