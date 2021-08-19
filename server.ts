/** @format */

import {
  Server,
  Client,
  Event,
  Packet,
} from 'https://deno.land/x/tcp_socket@0.0.1/mods.ts';

const server = new Server({ port: 8080 });

// Server listen
server.on(Event.listen, (server: Deno.Listener) => {
  let addr = server.addr as Deno.NetAddr;
  console.log(`Server listen ${addr.hostname}:${addr.port}`);
});

// Client connect
server.on(Event.connect, (client: Client) => {
  console.log('New Client -', client.info());
});

// Receive packet
server.on(Event.receive, (client: Client, data: Packet, length: number) => {
  console.log('Receive -', data.toString());
});

// Client close
server.on(Event.close, (client: Client) => {
  console.log('Client close -', client.info());
});

// Server finish
server.on(Event.shutdown, () => {
  console.log('Server is shutdown');
});

// Handle error
server.on(Event.error, (e) => {
  console.error(e);
});

// Do
await server.listen(); // Start listen
server.broadcast('Hello');
// server.broadcast('Hello', client); //Ignore broadcast
// server.broadcast('Hello', [client]); //Ignore broadcast
