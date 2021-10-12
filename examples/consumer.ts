// import fs from 'fs';
// import ip from 'ip';

import { Kafka,logLevel } from '../index.ts';
import PrettyConsoleLogger from './prettyConsoleLogger.js';

const host = '127.0.0.1'

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  logCreator: PrettyConsoleLogger,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer',
  ssl: {
    servername: 'localhost',
    rejectUnauthorized: false,
    ca: [Deno.readFileSync('./testHelpers/certs/cert-signed')],
  },
  sasl: {
    mechanism: 'plain',
    username: 'test',
    password: 'testtest',
  },
})

const topic = 'topic-test'
const consumer = kafka.consumer({ groupId: 'test-group' })

let msgNumber = 0
const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    //deno-lint-ignore require-await
    eachMessage: async ({ topic, partition, message }: any) => {
      msgNumber++
      kafka.logger().info('Message processed', {
        topic,
        partition,
        offset: message.offset,
        timestamp: message.timestamp,
        headers: Object.keys(message.headers).reduce(
          (headers, key) => ({
            ...headers,
            [key]: message.headers[key].toString(),
          }),
          {}
        ),
        key: message.key.toString(),
        value: message.value.toString(),
        msgNumber,
      })
    },
  })
}

run().catch(e => kafka.logger().error(`[example/consumer] ${e.message}`, { stack: e.stack }))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

// errorTypes.map(type => {
//   process.on(type, async e => {
//     try {
//       kafka.logger().info(`process.on ${type}`)
//       kafka.logger().error(e.message, { stack: e.stack })
//       await consumer.disconnect()
//       process.exit(0)
//     } catch (_) {
//       process.exit(1)
//     }
//   })
// })

// signalTraps.map(type => {
//   process.once(type, async () => {
//     console.log('')
//     kafka.logger().info('[example/consumer] disconnecting')
//     await consumer.disconnect()
//   })
// })
