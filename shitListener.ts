/** @format */

const listener = await Deno.listen({
  port: 2181,
  transport: 'tcp',
});

// const buf = new Uint8Array(512);

// console.log('Before reading');

// const heard = await listener.accept;

// console.log('YA HEARD ', heard);

const c = await listener.accept();

while (1) {
  let buf = new Uint8Array(512);
  const n = (await c.read(buf)) || 0;
  buf = buf.slice(0, n);
  console.log('B >> ', new TextDecoder().decode(buf));
  const msg = 'exit';
  console.log('A >> ', msg);
  if (msg === 'exit') {
    c.close();
    break;
  }
  await c.write(new TextEncoder().encode(msg));
}
