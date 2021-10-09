const KEEP_ALIVE_DELAY = 60000 // in ms
//keepalive?
/**
 * @returns {import("../../types").ISocketFactory}
 */
import net from 'https://raw.githubusercontent.com/cmorten/deno_std/b0ba0face0b5cbb67d36c05181e94e0a839ec7dd/node/net.ts'
import { Client, Event, Packet } from "https://deno.land/x/tcp_socket@0.0.2/mods.ts";

export default () => {

  return async ({ host, port, onConnect}: any) => { //async await????
    const socket = net.connect({ host, port }, onConnect)
    // await new Client({hostname: host, port: port})
    // // console.log("SAM SOCKET", socket);
    // socket.on(Event.connect, onConnect)
    // socket.connect();
    // // socket.on(Event.connect, onConnect)
    // // console.log('socket inside of SF', socket)

    socket.setKeepAlive(true, KEEP_ALIVE_DELAY)

    return socket;
  };
}
