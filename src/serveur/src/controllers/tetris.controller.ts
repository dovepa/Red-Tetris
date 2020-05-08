export const newTetri = async(ctx, next) => {
    await next();
    ctx.body = 'new message';
    return;
};