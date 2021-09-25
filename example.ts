/** @format */

import { Kafka } from './index.ts';

const kafka = new Kafka();

// console.log('kafka', kafka.producer());

kafka.producer();
const consumer = kafka.consumer();

console.log('consumer', consumer);

// const run = async () => {
//   await consumer.connect()
//   await consumer.subscribe({ topic, fromBeginning: true })
//   await consumer.run({
//     // eachBatch: async ({ batch }) => {
//     //   console.log(batch)
//     // },
//     eachMessage: async ({ topic, partition, message }) => {
//       msgNumber++
//       kafka.logger().info('Message processed', {
//         topic,
//         partition,
//         offset: message.offset,
//         timestamp: message.timestamp,
//         headers: Object.keys(message.headers).reduce(
//           (headers, key) => ({
//             ...headers,
//             [key]: message.headers[key].toString(),
//           }),
//           {}
//         ),
//         key: message.key.toString(),
//         value: message.value.toString(),
//         msgNumber,
//       })
//     },
//   })
// }
