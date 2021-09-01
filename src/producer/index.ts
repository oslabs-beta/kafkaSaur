/** @format */

import createProducer from './shitProducer.ts';

export default class Client {
  producer() {
    return createProducer();
  }
}
