/** @format */

import createProducer from './producer.ts';

export default class Client {
  producer() {
    return createProducer();
  }
}