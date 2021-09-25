/** @format */

const KEEP_ALIVE_DELAY = 60000; // in ms

/**
 * @returns {import("../../types").ISocketFactory}
 */
export default () => {
  // const net = require('net')
  // const tls = require('tls')

  return async ({ host, port, ssl, onConnect }: any) => {
    const socket = await Deno.connect(
      Object.assign({ host, port, transport: 'tcp' })
    );
    // : net.connect({ host, port }, onConnect)

    // socket.setKeepAlive(true, KEEP_ALIVE_DELAY)
    setTimeout(() => socket.close(), KEEP_ALIVE_DELAY);

    return socket;
  };
};

// func(string: string = date) {
//   const conn = await Deno.connect({
//     hostname: 'localhost',
//     port: 9093,
//     transport: 'tcp',
//   });
