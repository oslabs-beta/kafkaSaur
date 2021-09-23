/** @format */

export class SeekOffsets extends Map {
  set(topic: any, partition: any, offset: any) {
    super.set([topic, partition], offset);
  }

  has(topic: any, partition: any) {
    return Array.from(this.keys()).some(
      ([t, p]) => t === topic && p === partition
    );
  }

  pop() {
    if (this.size === 0) {
      return;
    }

    const [key, offset] = this.entries().next().value;
    this.delete(key);
    const [topic, partition] = key;
    return { topic, partition, offset };
  }
}
