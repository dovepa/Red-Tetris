import { environment } from './environments/environment';

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

const log = (...args: any[]): any => {
  if (environment.log === true) {
    // tslint:disable-next-line:no-console
    console.log('[[ Red-Tetris API ]] :: ', args);
  }
};

const error = (...args: any[]): any => {
  if (environment.log === true) {
    // tslint:disable-next-line:no-console
    console.log('[[ Red-Tetris API ]] [[ ERROR ]] :: ', args);
  }
};


export default { log, error, getRandomInt };