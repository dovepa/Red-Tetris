"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const json = require("koa-json");
const logger = require("koa-logger");
const Router = require("koa-router");
const utils = require("./utils");
const socket = require("socket.io");
const tetris_1 = require("./routes/tetris");
const room_1 = require("./routes/room");
const chat_1 = require("./routes/chat");
const socket_controller_1 = require("./controllers/socket.controller");
const dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + '/../.env' });
const app = new Koa();
const router = new Router();
// Index of API
router.get('/', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { msg: 'APP' };
    yield next();
}));
router.get('/api', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { msg: 'Red-Tetris API :: OK 😎 !' };
    yield next();
}));
// Middlewares
app.use(json());
app.use(logger());
// Routes
app.use(router.routes()).use(router.allowedMethods());
const nestedRoutes = [tetris_1.default, room_1.default, chat_1.default];
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
socket_controller_1.default(io);
