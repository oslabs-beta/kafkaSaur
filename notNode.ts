class notnode {
    
    constructor() {
hrtime(time?: [number, number]): [number, number] {
    const milli = performance.now();
    const sec = Math.floor(milli / 1000);
    const nano = Math.floor(milli * 1_000_000 - sec * 1_000_000_000);
    if (!time) {
      return [sec, nano];
    }
    const [prevSec, prevNano] = time;
    return [sec - prevSec, nano - prevNano];
  }

  /** https://nodejs.org/api/process.html#process_process_stderr */
  get stderr() {
    return {
      fd: Deno.stderr.rid,
      get isTTY(): boolean {
        return Deno.isatty(this.fd);
      },
      pipe(_destination: Deno.Writer, _options: { end: boolean }): void {
        // TODO(JayHelton): to be implemented
        notImplemented();
      },
      // deno-lint-ignore ban-types
      write(_chunk: string | Uint8Array, _callback: Function): void {
        // TODO(JayHelton): to be implemented
        notImplemented();
      },
      // deno-lint-ignore ban-types
      on(_event: string, _callback: Function): void {
        // TODO(JayHelton): to be implemented
        notImplemented();
      },
    };
  }
}