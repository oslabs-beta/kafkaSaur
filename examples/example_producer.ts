import { Kafka, logLevel } from '../index.ts';
import prettyConsolelogger2 from './prettyConsoleLogger2.ts'
import dinos from './dinosaurs.ts'

//declare host name
const host = 'localhost'

//intialize broker
const kafka = new Kafka({
  logLevel: logLevel.DEMO,
  logCreator: prettyConsolelogger2,
  brokers: [`${host}:9092`],
  clientId: 'example_producer',
})

//declare topic name
const topic = 'topic-test'
//intialize producer
const producer = kafka.producer()

//helper functions for creating our randomized message
const getRandomNumber = () => Math.round(Math.random() * 1000);
const getRandomDino = () => dinos[Math.floor(Math.random() * (dinos.length - 1))]

//function for creating randomized message
const createMessage = (num: number, dino: string) => ({
  key: `key-${num}`,
  value: `value-${num}-${dino}-${new Date().toISOString()}`,
  headers: {
    'correlation-id': `${num}-${Date.now()}`,
  },
})

//counters for logging purposes
let msgNumber = 0
let requestNumber = 0

//function for sending messages
const sendMessage = () => {
  //create a randomly sized array of messages
  const messages = Array(getRandomNumber())
    .fill(undefined)
    .map((_) => createMessage(getRandomNumber(), getRandomDino()))
    //increment the request number
    const requestId = requestNumber++ 
    //send the messages to the topic
    kafka.logger().info(`Sending ${messages.length} messages on request number #${requestId}...`)
    return producer 
      .send({
        topic,
        messages
      })
      .then(response => {
        kafka.logger().info(`Message successfully sent to topic: ${response[0].topicName} on partition ${response[0].partition} `)
      })
      .catch((e: Error) => 
      console.log(e)
    )
}

//main function to be run
const run = async () => {
  await producer.connect()
  setInterval(sendMessage, 5000)
}

run().catch((e)=>console.log(e))