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
}: any) => {
  const socket = socketFactory({ host, port, ssl, onConnect })
  
  
  socket.on('data', onData)
  socket.on('end', onEnd)
  socket.on('error', onError)
  socket.on('timeout', onTimeout)

  socket.on('connect', onConnect)

  socket.on('connect', ()=>console.log('****connect event triggered****'))
  socket.on('data', ()=> console.log('****data event triggered****'))
  socket.on('end', ()=>console.log('****end event triggered****'))
  socket.on('error', ()=>console.log('****error event triggered****'))
  socket.on('timeout', ()=>console.log('****timeout event triggered****'))

  socket.connect()
  
  return socket
}
