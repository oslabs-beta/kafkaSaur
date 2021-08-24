/** @format */

import { Application, Router, send } from 'https://deno.land/x/oak/mod.ts';

import producer from './shitProducer.ts';

const router = new Router();

router
  .get('/test', (ctx) => {
    ctx.response.body = 'Hello World!';
    producer();
  })
  .post('/test', (ctx) => {
    ctx.response.body = "You've posted!";
  })
  .delete('/test', (ctx) => {
    console.log('Request body ', ctx.request.body);
    ctx.response.body = 'You deleted!';
  });

const app = new Application();

app.use(router.routes());

app.use(router.allowedMethods());

app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    index: 'index.html',
  });
});

await app.listen({ port: 8000 });
