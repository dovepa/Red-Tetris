
import * as Koa from 'koa';
import * as json from 'koa-json';
import * as logger from 'koa-logger';
import * as Router from 'koa-router';
import * as utils from './utils';
import * as socket from 'socket.io';
import tetrisRoute from './routes/tetris';
import roomRoute from './routes/room';
import chatRoute from './routes/chat';
import socketController from './controllers/socket.controller';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/../.env' });

const app = new Koa();
const router = new Router();

// Index of API
router.get('/', async(ctx, next) => {
  ctx.body = { msg: 'APP' };
  await next();
});

router.get('/api', async(ctx, next) => {
  ctx.body = { msg: 'Red-Tetris API :: OK 😎 !' };
  await next();
});


// Middlewares
app.use(json());
app.use(logger());

// Routes
app.use(router.routes()).use(router.allowedMethods());

const nestedRoutes = [tetrisRoute, roomRoute, chatRoute];
for (const rt of nestedRoutes) {
  app.use(rt.routes()).use(rt.allowedMethods());
}

const PORT = process.env.SERVER_PORT || 3000;
const server = app.listen(PORT, () => {
  utils.log(`Red-Tetris API :: OK 😎 ! running on port : ${PORT}`);
});

const io = new socket(server, {
  pingTimeout: 500000,
  cookie: false
});
socketController(io);
