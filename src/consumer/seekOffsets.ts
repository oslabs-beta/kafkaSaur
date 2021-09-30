
export class SeekOffsets{
  constructor(private map: Map <any, any> = new Map()){}

  delete: any;
  entries: any;
  keys: any;
  size: any;
  
  public set(topic: any, partition: any, offset: any) {
    this.map.set([topic, partition], offset)

  }

  public has(topic: any, partition: any) {
    return Array.from(this.map.keys()).some(([t, p]) => t === topic && p === partition)
  }

  public pop() {
    if (this.map.size === 0) {
      return
    }

    const [key, offset] = this.map.entries().next().value
    this.map.delete(key)
    const [topic, partition] = key
    return { topic, partition, offset }
  }
}
