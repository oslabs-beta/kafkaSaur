const KEEP_ALIVE_DELAY = 60000 // in ms
//keepalive?
/**
 * @returns {import("../../types").ISocketFactory}
 */
//import net from 'https://raw.githubusercontent.com/cmorten/deno_std/b0ba0face0b5cbb67d36c05181e94e0a839ec7dd/node/net.ts'

import { Client } from './socketClass.ts'
import { EventEmitter } from "https://deno.land/std@0.110.0/node/events.ts";

export default () => {

  return async ({ host, port, onConnect}: any) => { //async await????
    
    const socket = new Client({hostName: host, port: port})
    
    
    socket.on('connect', onConnect)
    socket.on('connect', () => console.log('I connected'))
    // // socket.on(Event.connect, onConnect)
    // // console.log('socket inside of SF', socket)

    //socket.setKeepAlive(true, KEEP_ALIVE_DELAY)

    return socket;
  };
}
