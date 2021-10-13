//returns a function that intializes a socket object that can be used in socket.ts
/*
TODO - in KafkaJS, this was used to check for SSL and switch between net and tls modules
for socket creation.  This is no longer necessary, however it would take a good amount
of refactoring to completley remove this file.
*/

import { CustomSocket } from './socketClass.ts'

export default () => {
  //deno-lint-ignore no-explicit-any
  return ({ host, port, ssl }: {host: string, port: number, ssl: any}) => { 
    
    const socket = new CustomSocket({hostname: host, port: port, ssl: ssl}) 

    return socket;
  };
}
