import { Kafka, CompressionTypes, logLevel } from '../index.ts';
import PrettyConsoleLogger from './prettyConsoleLogger.js';
const host = '127.0.0.1';

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  logCreator: PrettyConsoleLogger,
  brokers: [`${host}:9092`],
  clientId: 'example-producer',
  //ssl: {
    //servername: 'localhost',
    //rejectUnauthorized: false,
    //ca: [Deno.readFileSync('./testHelpers/certs/cert-signed')], 
  //},
  //sasl: {
    //mechanism: 'plain',
    //username: 'test',
    //password: 'testtest',
  //},
});

const topic = 'spooky-ghost';
const producer = kafka.producer();

const getRandomNumber = () => Math.round(Math.random() * 1000);
const createMessage = (num: number) => ({
  key: `key-${num}`,
  value: `value-${num}-${new Date().toISOString()}`,
  headers: {
    'correlation-id': `${num}-${Date.now()}`,
  },
});

let msgNumber = 0;
let requestNumber = 0;
const sendMessage = () => {
  const messages = Array(getRandomNumber())
    .fill(undefined)
    .map((_) => createMessage(getRandomNumber()));

  const requestId = requestNumber++;
  msgNumber += messages.length;
  kafka.logger().info(`Sending ${messages.length} messages #${requestId}...`);
  return producer
    .send({
      topic,
      //compression: CompressionTypes.GZIP,
      messages,
    })
    .then((response: any) => {
      kafka.logger().info(`Messages sent #${requestId}`, {
        response,
        msgNumber,
      });
    })
    .catch((e: any) =>
      kafka
        .logger()
        .error(`[example/producer] ${e.message}`, { stack: e.stack })
    );
};

const run = async () => {
  await producer.connect();
  setInterval(sendMessage, 3000);
};

run().catch((e) =>
  kafka.logger().error(`[example/producer] ${e.message}`, { stack: e.stack })
);