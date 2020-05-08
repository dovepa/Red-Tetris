"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEBUG = true;
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};
exports.getRandomInt = getRandomInt;
const log = (...args) => {
    if (DEBUG === true)
        // tslint:disable-next-line:no-console
        console.log('[[ Red-Tetris API ]] :: ', args);
};
exports.log = log;
