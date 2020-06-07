import { Player } from './player.model';

export interface ToastMessage {
    percent: number;
    title: string;
    message: string;
    open: boolean;
}

export interface ToastAction extends ToastMessage {
    roomId: string;
    player: Player;
}

