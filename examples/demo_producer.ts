import { Kafka, logLevel } from '../index.ts';
import prettyConsolelogger2 from './prettyConsoleLogger2.ts'

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
const topic = 'adam-test-1'
//intialize producer
const producer = kafka.producer()

//helper functions for creating our randomized message
const getOrderNumber = () => Math.round(Math.random() * 100000);
const getAmount = () => Math.round(Math.random() * 20)
const getPrice = () => Math.round(Math.random()* 100);
const pickCandy = (arr: string[]) => {
  return arr[Math.round(Math.random() * arr.length)]
}
const candy = ['Kit-Kat', 'Toothpaste', 'M&Ms', 'Skittles', 'Snickers', '3 Musketeers', 'Jolly Rancher', 'Werthers Originals', 'Candy Corn', 'Gummy Bears']

//generate 3 variables - price, order number, 

//function for creating randomized message
const createMessage = (orderNum: number, amount: number, price: number, candy: string) => ({
  key: `key-${orderNum}`,
  value: `{ Order number: ${orderNum}, Quantity: ${amount}, Item: ${candy}, Total: $${price}.00 }`,
  headers: {
    'correlation-id': `${orderNum}-${Date.now()}`,
  },
})



//counters for logging purposes
let requestNumber = 0

//function for sending messages
const sendMessage = () => {
  //create a randomly sized array of messages
  const messages = new Array;
  const orderNum = getOrderNumber()
  messages.push(createMessage(orderNum, getAmount(), getPrice(), pickCandy(candy)))
    //increment the request number
    const requestId = requestNumber++ 
    //send the messages to the topic
    return producer 
      .send({
        topic,
        messages
      })
      .then(response => {
        kafka.logger().demo(`Order number ${orderNum} sent to topic: ${response[0].topicName} on partition ${response[0].partition}`)
      })
      .catch((e: Error) => 
      console.log(e)
    )
}

//main function to be run in setinterval
const run = async () => {
  await producer.connect()
  setInterval(sendMessage, 1)
}

run().catch((e)=>console.log(e))