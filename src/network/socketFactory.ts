const KEEP_ALIVE_DELAY = 60000 // in ms

/**
 * @returns {import("../../types").ISocketFactory}
 */
export default () => {
  //NEED TO REFACTOR WITH DENO SOCKETS, purposely leavig these in so compiling fails
  const net = require('net')
  const tls = require('tls')

  return ({
    host,
    port,
    ssl,
    onConnect
  }: any) => {
    const socket = ssl
      // deno.connect()
       ? tls.connect(Object.assign({ host, port, servername: host }, ssl), onConnect)
       : net.connect({ host, port }, onConnect)

    socket.setKeepAlive(true, KEEP_ALIVE_DELAY)

    return socket
  };
}
