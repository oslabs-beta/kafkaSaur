import { Client, Packet, Event } from "https://deno.land/x/tcp_socket@0.0.1/mods.ts";

let temp = await Deno.connect({hostname: '127.0.0.1', port:8080})
console.log(temp.toString())

// const client = new Client({ hostname: "127.0.0.1", port: 8080 });

// // Connection open
// client.on(Event.connect, (client: Client) => {
//   console.log(client)
//   console.log("Connect", client.conn?.remoteAddr);
// });

// // Receive message
// client.on(Event.receive, (client: Client, data: Packet) => {
//   console.log("Receive", data.toString());
// });

// // Connection close
// client.on(Event.close, (client: Client) => {
//   console.log("Close");
// });

// // Handle error
// client.on(Event.error, (e) => {
//   console.error(e);
// });

// // Do
// await client.connect(); // Start client connect
// await client.write("Hello World"); // Send string data