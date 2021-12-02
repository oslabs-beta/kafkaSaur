import { Kafka, logLevel } from '../index.ts';
import prettyConsolelogger2 from './prettyConsoleLogger2.ts'

const host = 'localhost'

const kafka = new Kafka({
  logLevel: logLevel.DEMO,
  logCreator: prettyConsolelogger2,
  brokers: [`${host}:9092`],
  clientId: 'example_producer',
})

const topic = 'adam-test-3'
//intialize producer
const producer = kafka.producer()

const getOrderNumber = () => Math.round(Math.random() * 100000);
const getAmount = () => Math.round(Math.random() * 20)
const getPrice = () => Math.round(Math.random()* 100);
const pickCandy = (arr: string[]) => {
  return arr[Math.round(Math.random() * arr.length)]
}
const candy = ['Kit-Kat', 'Toothpaste', 'M&Ms', 'Skittles', 'Snickers', '3 Musketeers', 'Jolly Rancher', 'Werthers Originals', 'Candy Corn', 'Gummy Bears']

const createMessage = (orderNum: number, amount: number, price: number, candy: string) => ({
  key: `key-${orderNum}`,
  value: `{ Order number: ${orderNum}, Quantity: ${amount}, Item: ${candy}, Total: $${price}.00 }`,
  headers: {
    'correlation-id': `${orderNum}-${Date.now()}`,
  },
})

const sendMessage = () => {
  const messages = [];
  const orderNum = getOrderNumber()
  messages.push(createMessage(orderNum, getAmount(), getPrice(), pickCandy(candy)))

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

const run = async () => {
  await producer.connect()
  setInterval(sendMessage, 5000)
}

run().catch((e)=>console.log(e))