import { Kafka,logLevel } from '../index.ts';
import prettyConsolelogger2 from './prettyConsoleLogger2.ts'

//declare host name
const host = 'localhost'

//intialize broker
const kafka = new Kafka({
  logLevel: logLevel.DEMO,
  logCreator: prettyConsolelogger2,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer1',
})

//declare topic name
const topic = 'adam-test-3'
//initialize consumer and group ID
const consumer = kafka.consumer({ groupId: 'test-group-inventory' })

//main function to be run
const run = async () => {
  let itemsSold = 0;
  //connect
  await consumer.connect()
  //subscribe to topic
  await consumer.subscribe({ topic, fromBeginning: true })
  //run eachMessage function
  await consumer.run({
    //deno-lint-ignore require-await
    eachMessage: async ({ topic, partition, message }: any) => {
      
      
      //msgNumber++
      kafka.logger().info('Inventory System - Order Processed', {
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
        messages_proccessed_this_run: itemsSold
        //msgNumber,
      })
      itemsSold++
    },
  })
}

run().catch((e)=>console.log(e))