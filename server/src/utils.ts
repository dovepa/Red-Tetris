import { environment } from './environments/environment';

export const regex = RegExp(/^[a-zA-Z0-9]*$/);

export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const log = (...args: any[]): any => {
  if (environment.log === true) {
    // tslint:disable-next-line:no-console
    console.log('[[ Red-Tetris API ]] :: ', args);
  }
};

export const error = (...args: any[]): any => {
  if (environment.log === true) {
    // tslint:disable-next-line:no-console
    console.log('[[ Red-Tetris API ]] [[ ERROR ]] :: ', args);
  }
};

