export class SeekOffsets extends Map {
  delete: any;
  entries: any;
  keys: any;
  size: any;
  set(topic: any, partition: any, offset: any) {
    super.set([topic, partition], offset)
  }

  has(topic: any, partition: any) {
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'from' does not exist on type 'ArrayConst... Remove this comment to see the full error message
    return Array.from(this.keys()).some(([t, p]) => t === topic && p === partition)
  }

  pop() {
    if (this.size === 0) {
      return
    }

    const [key, offset] = this.entries().next().value
    this.delete(key)
    const [topic, partition] = key
    return { topic, partition, offset }
  }
}
