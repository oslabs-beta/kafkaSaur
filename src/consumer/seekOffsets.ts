
export class SeekOffsets extends Map {
  delete: any;
  entries: any;
  keys: any;
  size: any;
  set(topic: any, partition: any, offset: any) {
    super.set([topic, partition], offset)

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
