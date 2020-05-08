import * as Router from 'koa-router';
import * as ctrl from '../controllers/chat.controller';
const router = new Router({ prefix: '/api/chat' });

router.get('/', async(ctx, next) => {
    ctx.body = 'chat';
});

// router.get('/getMessage', ctrl.getMessage(ctx));
// router.post('/newMessage', ctrl.newMessage);

export default router;