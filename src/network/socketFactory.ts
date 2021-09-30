const KEEP_ALIVE_DELAY = 60000 // in ms

/**
 * @returns {import("../../types").ISocketFactory}
 */
export default () => {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  const net = require('net')
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
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
