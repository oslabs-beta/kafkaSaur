/**
 * @param {Object} options
 * @param {import("../../types").ISocketFactory} options.socketFactory
 * @param {string} options.host
 * @param {number} options.port
 * @param {Object} options.ssl
 * @param {() => void} options.onConnect
 * @param {(data: Buffer) => void} options.onData
 * @param {() => void} options.onEnd
 * @param {(err: Error) => void} options.onError
 * @param {() => void} options.onTimeout
 */
 //import { Client, Event, Packet } from "https://deno.land/x/tcp_socket@0.0.2/mods.ts";
export default async ({
  socketFactory,
  host,
  port,
  ssl,
  onConnect,
  onData,
  onEnd,
  onError,
  onTimeout
}: any) => {
  const socket = await socketFactory({ host, port, ssl, onConnect })
  
  console.log('THIS.WRITE ', socket.write);
  console.log('THIS.CLOSE ', socket.close);

  socket.on('data', onData)
  socket.on('end', onEnd)
  socket.on('error', onError)
  socket.on('timeout', onTimeout)
  socket.connect();

  return socket
}
