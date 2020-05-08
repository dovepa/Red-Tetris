"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};
exports.getRandomInt = getRandomInt;
const log = (...args) => {
    if (process.env.DEBUG === 'true') {
        // tslint:disable-next-line:no-console
        console.log('[[ Red-Tetris API ]] :: ', args);
    }
};
exports.log = log;
const error = (...args) => {
    if (process.env.DEBUG === 'true') {
        // tslint:disable-next-line:no-console
        console.log('[[ Red-Tetris API ]] [[ ERROR ]] :: ', args);
    }
};
exports.error = error;
