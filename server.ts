/** @format */

import { Application, Router, send } from 'https://deno.land/x/oak/mod.ts';

import producer from './shitProducer.ts';

// import {
//   createBodyParser,
//   JsonBodyParser,
// } from "https://deno.land/x/body_parser@v0.0.1/mod.ts";

const router = new Router();
const app = new Application();

// app.use(async (ctx) => {
//   const jsonCtx = await ctx.json();
//   return jsonCtx;
// });

router
  .post('/test', (ctx: any) => {
    ctx.response.body = `You produced the message ${JSON.stringify(
      ctx.request.body()
    )}`;

    producer();
  })
  .delete('/test', (ctx) => {
    console.log('Request body ', ctx.request.body);
    ctx.response.body = 'You deleted!';
  });

app.use(router.routes());

app.use(router.allowedMethods());

app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    index: 'index.html',
  });
});

await app.listen({ port: 8000 });
