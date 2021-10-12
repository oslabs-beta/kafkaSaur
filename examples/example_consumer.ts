import { Kafka,logLevel } from '../index.ts';
import PrettyConsoleLogger from './prettyConsoleLogger.js';

const host = 'localhost'

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  logCreator: PrettyConsoleLogger,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer',
})

const topic = 'topic-test'
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    //deno-lint-ignore require-await
    eachMessage: async ({ message }: any) => {
      console.log(message.key.toString(), message.value.toString())
    },
    
    // eachMessage: async ({ topic, partition, message }: any) => {
    //   msgNumber++
    //   kafka.logger().info('Message processed', {
    //     topic,
    //     partition,
    //     offset: message.offset,
    //     timestamp: message.timestamp,
    //     headers: Object.keys(message.headers).reduce(
    //       (headers, key) => ({
    //         ...headers,
    //         [key]: message.headers[key].toString(),
    //       }),
    //       {}
    //     ),
    //     key: message.key.toString(),
    //     value: message.value.toString(),
    //     msgNumber,
    //   })
    // },
  })
}

run().catch((e)=>console.log(e))