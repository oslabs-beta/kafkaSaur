const KEEP_ALIVE_DELAY = 60000 // in ms

/**
 * @returns {import("../../types").ISocketFactory}
 */
export default () => {
  //NEED TO REFACTOR WITH DENO SOCKETS, purposely leavig these in so compiling fails
  // const net = require('net')
  // const tls = require('tls')

  return async ({
    host,
    port,
    ssl,
    onConnect
  }: any) => {


    const socket = await Deno.connect({ 
      hostname: 'localhost',
      port: 9093,
      transport: 'tcp',
      
    });
    
    //socket.setKeepAlive(true, KEEP_ALIVE_DELAY)

    return socket;

  };
}
