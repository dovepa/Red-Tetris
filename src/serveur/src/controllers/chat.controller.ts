import { Chat } from '../models/message.model';

export const getMessage = async(ctx, next) => {
    await next();
    ctx.body = 'get message';
    return;
};

export const newMessage = async(ctx, next) => {
    await next();
    ctx.body = 'new message';
    return;
};