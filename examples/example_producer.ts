import { Kafka, logLevel } from '../index.ts';
import dinos from './dinosaurs.ts'

//declare host name
const host = 'localhost'

//intialize broker
const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
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

//function for sending messages
const sendMessage = () => {
  //create an array of messages
  const messages = Array(getRandomNumber())
    .fill(undefined)
    .map((_) => createMessage(getRandomNumber(), getRandomDino()))
    //send the messages to the topic
    return producer 
      .send({
        topic,
        messages
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