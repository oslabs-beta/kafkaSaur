import { Kafka,logLevel } from '../index.ts';
import prettyConsolelogger2 from './prettyConsoleLogger2.ts'

//declare host name
const host = 'localhost'

//intialize broker
const kafka = new Kafka({
  logLevel: logLevel.DEMO,
  logCreator: prettyConsolelogger2,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer2',
})

//declare topic name
const topic = 'adam-test-3'
//initialize consumer and group ID
const consumer = kafka.consumer({ groupId: 'test-group-payment' })

//main function to be run
const run = async () => {
  let sales = 0;
  //connect
  await consumer.connect()
  //subscribe to topic
  await consumer.subscribe({ topic, fromBeginning: true })
  //run eachMessage function
  await consumer.run({
    //deno-lint-ignore require-await
    eachMessage: async ({ topic, partition, message }: any) => {
      const amt = /([0-9]+\.[0-9]+)/.exec(message.value.toString())
      //@ts-ignore
      sales += parseInt(amt[0])
      kafka.logger().info(`Payment System - Order Processed...total sales: ${sales}.00`, {
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
      })
    },
  })
}

run().catch((e)=>console.log(e))