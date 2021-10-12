//const KEEP_ALIVE_DELAY = 60000 // in ms
//keepalive?
/**
 * @returns {import("../../types").ISocketFactory}
 */

 import { Client } from './socketClass.ts'

export default () => {

  return ({ host, port, onConnect}: any) => { 

    
    const socket = new Client({hostname: host, port: port})  
    //socket.connect();
    // const socket = await Deno.connect({hostname: host, port: port})
    return socket;
  };
}
