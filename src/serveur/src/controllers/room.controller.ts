export const createRoom = async(ctx, next) => {
    await next();
    ctx.body = 'new message';
    return;
};