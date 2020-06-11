import { environment } from '../environments/environment';

export const regex = RegExp(/^[a-zA-Z0-9]*$/);

export const urlServer = (): string => {
    let url = environment.serverAdress + environment.serverPort;
    if (environment.production) {
        url = `${window.location.protocol}//${window.location.host}`;
    }
    return url;
};

export const apiUrl = (...args: string[]): string => {
    let url = urlServer();
    url = url.concat('/api');
    args.forEach(path => {
        url = url.concat('/' + path);
    });
    return url;
};

export const stopAll = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
};

export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max));
};

export const log = (...args: any[]): void => {
    if (environment.log === true) {
        // tslint:disable-next-line:no-console
        console.log('[[ Red-Tetris APP ]] :: ', args);
    }
};

export const error = (...args: any[]): void => {
    if (environment.log === true) {
        // tslint:disable-next-line:no-console
        console.log('[[ Red-Tetris APP ]] [[ ERROR ]] :: ', args);
    }
};



