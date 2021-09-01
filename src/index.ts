/** @format */

import createProducer from './producer/index.ts';

export default class Client {
  producer() {
    return createProducer();
  }
}
