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
const player_model_1 = require("./models/player.model");
const uniqid_1 = require("uniqid");
const app = new Koa();
const router = new Router();
// Index of API
router.get('/', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { msg: 'Red-Tetris API :: OK 😎 !' };
    yield next();
}));
// Middlewares
app.use(json());
app.use(logger());
// Routes
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log(uniqid_1.default());
    utils.log('Red-Tetris API :: OK 😎 !');
    console.log(new player_model_1.Player('the best', 'dove'));
});
