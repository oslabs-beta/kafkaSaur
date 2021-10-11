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

const topic = 'jesus-help';
const producer = kafka.producer();

const createMessage = (num: number) => ({
  key: `key-${num}`,
  value: `value-${num}-${new Date().toISOString()}`,
  headers: {
    'correlation-id': `${num}-${Date.now()}`,
  },
});

const sendMe : any[] = [];
sendMe.push(createMessage(100))

const sendMessage = () => {
  return producer.send({
    topic,
    //compression: CompressionTypes.GZIP,
    messages: sendMe
  })
}

const run = async () => {
  await producer.connect();
  sendMessage();
};

run().catch((e) =>
  kafka.logger().error(`[example/producer] ${e.message}`, { stack: e.stack })
);