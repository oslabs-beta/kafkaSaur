const KEEP_ALIVE_DELAY = 60000 // in ms

/**
 * @returns {import("../../types").ISocketFactory}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export () => {
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
      ? // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
        tls.connect(Object.assign({ host, port, servername: host }, ssl), onConnect)
      : net.connect({ host, port }, onConnect)

    socket.setKeepAlive(true, KEEP_ALIVE_DELAY)

    return socket
  };
}
