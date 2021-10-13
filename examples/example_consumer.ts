import { Kafka,logLevel } from '../index.ts';

//declare host name
const host = 'localhost'

//intialize broker
const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer',
})

//declare topic name
const topic = 'topic-test'
//initialize producer and group ID
const consumer = kafka.consumer({ groupId: 'test-group' })

//main function to be run
const run = async () => {
  //connect
  await consumer.connect()
  //subscribe to topic
  await consumer.subscribe({ topic, fromBeginning: true })
  //run a console.log on eachMessage
  await consumer.run({
    //deno-lint-ignore require-await
    eachMessage: async ({ message }: any) => {
      console.log(message.key.toString(), message.value.toString())
    },
  })
}

run().catch((e)=>console.log(e))