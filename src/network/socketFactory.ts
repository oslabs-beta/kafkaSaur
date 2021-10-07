//const KEEP_ALIVE_DELAY = 60000 // in ms
//keepalive?
/**
 * @returns {import("../../types").ISocketFactory}
 */

import { Client, Event, Packet } from "https://deno.land/x/tcp_socket@0.0.1/mods.ts";

export default () => {

  return ({ host, port, onConnect}: any) => { //async await????
    const socket = new Client({hostname: host, port: port})
    socket.on(Event.connect, ()=>console.log('connected', socket))
    socket.connect();
    // socket.on(Event.connect, onConnect)
    // console.log('socket inside of SF', socket)
    return socket;
  };
}
