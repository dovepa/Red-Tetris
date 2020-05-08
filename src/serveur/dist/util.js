"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DEBUG = true;
let log = (...args) => {
    if (DEBUG === true)
        console.log("[[ Red-Tetris API ]] :: ", args);
};
exports.log = log;
