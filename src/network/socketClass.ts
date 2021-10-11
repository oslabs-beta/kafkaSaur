import { EventEmitter } from "https://deno.land/std@0.110.0/node/events.ts";
import {Buffer} from "https://deno.land/std@0.110.0/node/buffer.ts";

export class Client extends EventEmitter{
  conn?: Deno.Conn;
  isOpen: boolean = false;
  options: any

  constructor(options?: any) {
    super();
    this.options = {
      hostName: options?.hostName || '127.0.0.1',
      port: options?.port || 8080,
      transport: options?.transport || "tcp",
      chunkSize: options?.chunkSize || 1024 * 1024
    };
  }

  async connect() {
    try {
      const conn = await Deno.connect(this.options);
      this.open(conn);
    } catch (e: any) {
      this.emit('connect', this, e);
      this.close();
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.emit('close', this);
      this.conn?.close();
    }
  }

  info(): string {
    if (this.conn?.remoteAddr as Deno.NetAddr) {
      let remote = <Deno.NetAddr> this.conn?.remoteAddr;
      return `[${remote.transport}] ${remote.hostname}:${remote.port} { isOpen: ${this.isOpen} }`;
    } else {
      return JSON.stringify(this.conn);
    }
  }

  async open(conn: Deno.Conn) {
    try {
      this.isOpen = true;
      this.conn = conn;
      this.emit('connect', this);
      
      for await (const buffer of Deno.iter(conn, {bufSize: this.options.chunkSize!})) {
        this.emit('receive', this, new Buffer(), buffer.length)
      }
      this.close();
    } catch (e: any) {
      if (e instanceof Deno.errors.BadResource) {
        this.close();
      } else {
        this.emit('error', this, e);
        this.close();
      }
    }
  }

  async write(data: Buffer): Promise<number> {
    let write = await this.conn?.write(data);
    console.log('write completed')
    //const temp = new Buffer(100)
    // let read = await this.conn?.read(temp)
    // console.log(read)
	return Promise.resolve(<number>write)
  }
}