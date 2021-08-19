/** @format */

import {
  Client,
  Packet,
  Event,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';

async function func() {
  const conn = await Deno.connect({
    hostname: 'localhost',
    port: 9093,
    transport: 'tcp',
  });
  console.log('Connected', conn);

  const array = [
    0, 81, 99, 111, 110, 115, 117, 109, 101, 114, 45, 103, 114, 111, 117, 112,
    45, 105, 100, 45, 52, 99, 52, 53, 54, 48, 48, 48, 49, 53, 49, 102, 48, 57,
    52, 98, 54, 48, 48, 100, 45, 50, 54, 55, 54, 50, 45, 102, 100, 54, 97, 54,
    97, 101, 55, 45, 51, 102, 54, 54, 45, 52, 48, 56, 101, 45, 56, 48, 50, 101,
    45, 100, 50, 54, 49, 100, 54, 57, 56, 51, 100, 48, 100, 0, 0, 0, 1, 0, 105,
    116, 101, 115, 116, 45, 49, 52, 100, 97, 49, 98, 52, 49, 97, 99, 54, 56, 56,
    97, 54, 100, 99, 98, 55, 56, 45, 50, 54, 55, 54, 50, 45, 52, 100, 97, 99,
    56, 101, 49, 50, 45, 100, 99, 50, 56, 45, 52, 100, 98, 50, 45, 56, 52, 53,
    54, 45, 57, 53, 98, 99, 54, 99, 49, 53, 56, 57, 98, 98, 45, 55, 98, 97, 100,
    49, 101, 56, 52, 45, 99, 50, 100, 101, 45, 52, 99, 99, 54, 45, 56, 48, 55,
    49, 45, 98, 97, 100, 98, 50, 55, 99, 56, 54, 49, 54, 54, 0, 105, 116, 101,
    115, 116, 45, 49, 52, 100, 97, 49, 98, 52, 49, 97, 99, 54, 56, 56, 97, 54,
    100, 99, 98, 55, 56, 45, 50, 54, 55, 54, 50, 45, 52, 100, 97, 99, 56, 101,
    49, 50, 45, 100, 99, 50, 56, 45, 52, 100, 98, 50, 45, 56, 52, 53, 54, 45,
    57, 53, 98, 99, 54, 99, 49, 53, 56, 57, 98, 98, 45, 55, 98, 97, 100, 49,
    101, 56, 52, 45, 99, 50, 100, 101, 45, 52, 99, 99, 54, 45, 56, 48, 55, 49,
    45, 98, 97, 100, 98, 50, 55, 99, 56, 54, 49, 54, 54,
  ];

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  var buf = new Uint8Array(301);

  array.map((el, i) => (buf[i] = el));

  console.log(buf); // 42

  console.log(buf);
  const hello = await conn.write(buf);

  console.log('Is this real life? ', hello);
  // console.log('con.read.buf', await conn.read(buf));
  // await conn.read(buf);
  console.log('Client-Response:', decoder.decode(buf));

  const decoded = decoder.decode(buf);
  console.log('Encoded shit: ', encoder.encode(decoded));
  conn.close();
}

func();

// const client = new Client({
//   hostname: 'localhost',
//   port: 8080,
// });

// for (let i = 0; i < 2; i++) {
//   // Connection open
//   client.on(Event.connect, (client: Client) => {
//     console.log('Connect', client.conn?.remoteAddr);
//   });

//   // Receive message
//   client.on(Event.receive, (client: Client, data: Packet) => {
//     console.log('Receive', data.toString());
//   });

//   // Connection close
//   client.on(Event.close, (client: Client) => {
//     console.log('Close');
//   });

//   // Handle error
//   client.on(Event.error, (e) => {
//     console.error(e);
//   });

//   // Do
//   await client.connect(); // Start client connect
//   await client.write('Hello World'); // Send string data
//   await client.write(new Uint8Array()); // Send Uint8Array data
//   client.close();
// }
