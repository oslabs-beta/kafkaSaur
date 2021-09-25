/** @format */

import createProducer from './producer/index.ts';
import createConsumer from './consumer/index.ts';
//error left on purpose
export default class Client {
  producer() {
    return createProducer();
  }
  consumer() {
    return createConsumer({ groupId: ' ' });
  }
}
