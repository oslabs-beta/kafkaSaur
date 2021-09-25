/** @format */

// interface Map<K, V> {
//   clear(): void;
//   delete(key: K): boolean;
//   forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
//   get(key: K): V | undefined;
//   has(key: K): boolean;
//   set(key: K, value: V): this;
//   readonly size: number;

/* export class PersonRestService {

  constructor(private restService: RestService) {
  }
  public get<T>(params?: HttpParams): Observable<T> {
    return this.restService.get<T>('person', params);
  }
}

constructor(private map: Map){
}
public set(){
  returns this.map.set
}
 

extends Map */

export class SeekOffsets {
  //refactored to make Map class private to allow for redefinition of legacy methods

  constructor(private map: Map<any, any> = new Map()) {}

  public set(topic: any, partition: any, offset: any) {
    this.map.set([topic, partition], offset);
  }

  public has(topic: any, partition: any) {
    return Array.from(this.map.keys()).some(
      ([t, p]) => t === topic && p === partition
    );
  }

  public pop() {
    if (this.map.size === 0) {
      return;
    }

    const [key, offset] = this.map.entries().next().value;
    this.map.delete(key);
    const [topic, partition] = key;
    return { topic, partition, offset };
  }
}
