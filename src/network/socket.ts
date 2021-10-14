//deno-lint-ignore-file no-explicit-any

import { ISocketFactory } from '../../index.d.ts'

interface SocketOptions {
  socketFactory: ISocketFactory
  host: string;
  port: number;
  ssl: any;
  onConnect: () => void;
  onData: (data: any) => void;
  onEnd: () => void;
  onError: (e: Error) => void;
  onTimeout: () => void;
}

export default ({
  socketFactory,
  host,
  port,
  ssl,
  onConnect,
  onData,
  onEnd,
  onError,
  onTimeout
}: SocketOptions) => {
  //create the socket
  const socket = socketFactory({ host, port, ssl, onConnect })
  //assign events to functions
  socket.on('data', onData)
  socket.on('end', onEnd)
  socket.on('error', onError)
  socket.on('timeout', onTimeout)
  socket.on('connect', onConnect)
  //connect and return
  socket.connect()
  
  return socket
}
