import { Player } from './player.model';

export interface ToastMessage {
    percent: number;
    title: string;
    message: string;
    open: boolean;
}
