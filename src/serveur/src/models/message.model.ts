export interface Message {
    timestamp: string;
    roomId: string;
    playerId: string;
    content: string;
}

export interface Chat {
    message: Message[];
}