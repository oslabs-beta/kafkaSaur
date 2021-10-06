/** @format */

//const ip = require('ip')
import process from 'https://deno.land/std@0.110.0/node/process.ts';

import { Kafka, CompressionTypes, logLevel } from '../index.ts';
import PrettyConsoleLogger from './prettyConsoleLogger.js';

const host = 'localhost';

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  logCreator: PrettyConsoleLogger,
  brokers: [`${host}:9093`],
  clientId: 'example-producer',
  ssl: {
    servername: 'localhost',
    rejectUnauthorized: false,
    ca: [Deno.readFileSync('./testHelpers/certs/cert-signed')], //'uft-8' was in readFileSync for dinner
  },
  sasl: {
    mechanism: 'plain',
    username: 'test',
    password: 'testtest',
  },
});

const topic = 'topic-test';
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
      compression: CompressionTypes.GZIP,
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

let intervalId: any;
const run = async () => {
  await producer.connect();
  intervalId = setInterval(sendMessage, 3000);
};

run().catch((e) =>
  kafka.logger().error(`[example/producer] ${e.message}`, { stack: e.stack })
);

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

// errorTypes.map((type) => {
//   process.on(type, async (e: any) => {
//     try {
//       kafka.logger().info(`process.on ${type}`);
//       kafka.logger().error(e.message, { stack: e.stack });
//       await producer.disconnect();
//       process.exit(0);
//     } catch (_) {
//       process.exit(1);
//     }
//   });
// });

// signalTraps.map((type) => {
//   process.once(type, async () => {
//     console.log('');
//     kafka.logger().info('[example/producer] disconnecting');
//     clearInterval(intervalId);
//     await producer.disconnect();
//   });
// });
