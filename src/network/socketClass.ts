import { EventEmitter } from "https://deno.land/std@0.110.0/node/events.ts";
import {Buffer} from "https://deno.land/std@0.110.0/node/buffer.ts";
import {iter} from 'https://deno.land/std@0.110.0/io/util.ts'

export class Client extends EventEmitter{
  conn?: Deno.Conn;
  isOpen: boolean = false;
  options: any

  constructor(options?: any) {
    super();
    this.options = {
      hostName: options?.hostName || '127.0.0.1',
      port: options?.port || 9092,
      transport: options?.transport || "tcp",
      //chunkSize: options?.chunkSize || 1024 * 1024
    };
  }
  async connect() {
    const conn = await Deno.connect(this.options);
    this.open(conn);
  }

  close() {
    this.emit('close', this);
    this.conn?.close();
  }

  async open(conn: Deno.Conn) {
    try {
      this.isOpen = true;
      this.conn = conn;
      this.emit('connect', this);
      console.log('inside open, this.conn', conn)
      
      for await (const buffer of iter(conn)) {
        this.emit('data', buffer)
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
   
	  return Promise.resolve(<number>write)
  }
}