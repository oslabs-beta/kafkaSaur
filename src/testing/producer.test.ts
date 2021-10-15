//wORK IN PROGRESS

// import {
//   assertEquals,
//   assertExists,
//   assertObjectMatch,
// } from 'https://deno.land/std@0.110.0/testing/asserts.ts';

// import {
//   afterEach,
//   beforeEach,
//   describe,
//   expect,
//   it,
//   run,
// } from 'https://deno.land/x/tincan/mod.ts';

// import {
//   bench,
//   BenchmarkRunProgress,
//   ProgressState,
//   runBenchmarks,
// } from 'https://deno.land/std@0.110.0/testing/bench.ts';

// import { Kafka as Client, logLevel } from '../index.ts';
// import createProducer from '../src/producer/index.ts';
// import createConsumer from '../src/consumer/index.ts';
// import createAdmin from '../src/admin/index.ts';
// import { Cluster } from '../src/cluster/index.ts';
// import ISOLATION_LEVEL from '../src/protocol/isolationLevel.ts';
// import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
// import { spy, Spy } from 'https://deno.land/x/mock@0.10.1/mod.ts';
// import { assertSpyCall } from 'https://deno.land/x/mock@0.10.1/asserts.ts';

// import {
//   secureRandom,
//   createCluster,
//   waitForConsumerToJoinGroup,
//   waitForMessages,
//   newLogger,
//   createTopic,
//   createModPartitioner,
// } from '../testHelpers/index.ts';

// const PRIVATE = {
//   CREATE_CLUSTER: Symbol('private:Kafka:createCluster') as unknown as string,
//   CLUSTER_RETRY: Symbol('private:Kafka:clusterRetry') as unknown as string,
//   LOGGER: Symbol('private:Kafka:logger') as unknown as string,
//   OFFSETS: Symbol('private:Kafka:offsets') as unknown as string,
// };

// Deno.test('testing example', (): void => {
//   assertEquals('world', 'world');
//   assertEquals({ hello: 'world' }, { hello: 'world' });
// });

// // Deno.test({
// //   name: "testing example",
// //   fn(): void {
// //     assertEquals("squirrel", "world");
// //     assertEquals({ hello: "world" }, { hello: "world" });
// //   },
// // });

// Deno.test('testing a producer on a  Kafka Client', () => {
//   bench(function createClient(time): void {
//     time.start();
//     const testClient = new Client({ brokers: [`localhost:9092`] });
//     assertExists(testClient.producer());

//     time.stop();
//   });

//   runBenchmarks();
// });

// // const kafka = new Kafka({
// // logLevel: logLevel.INFO,
// // logCreator: PrettyConsoleLogger,
// // brokers: [`${host}:9092`],
// // clientId: 'example-producer',
// // ssl: {
// //   servername: 'localhost',
// //   rejectUnauthorized: false,
// //   ca: [Deno.readFileSync('./testHelpers/certs/cert-signed')],
// // },
// // sasl: {
// //   mechanism: 'plain',
// //   username: 'test',
// //   password: 'testtest',
// // },
// //});

// Deno.test('testing a consumer on a  Kafka Client', () => {
//   bench(function createClient(time): void {
//     time.start();
//     const testClient = new Client({
//       logLevel: logLevel.INFO,
//       // logCreator: PrettyConsoleLogger,
//       brokers: [`localhost:9092`],
//       clientId: 'example-consumer',
//     });

//     assertExists(testClient.consumer({ groupId: 'test-group' }));

//     time.stop();
//   });

//   runBenchmarks();
// });

// describe('Consumer', () => {
//   let topicName: any,
//     groupId: any,
//     cluster: any,
//     producer: any,
//     consumer: any,
//     admin: any;

//   beforeEach(async () => {
//     topicName = `test-topic-${secureRandom()}`;
//     groupId = `consumer-group-id-${secureRandom()}`;

//     await createTopic({ topic: topicName });

//     cluster = createCluster();
//     admin = createAdmin({
//       cluster,
//       logger: newLogger(),
//     });

//     producer = createProducer({
//       cluster,
//       createPartitioner: createModPartitioner,
//       logger: newLogger(),
//     });

//     consumer = createConsumer({
//       cluster,
//       groupId,
//       maxWaitTimeInMs: 100,
//       logger: newLogger(),
//     });
//   });

//   afterEach(async () => {
//     admin && (await admin.disconnect());
//     consumer && (await consumer.disconnect());
//     producer && (await producer.disconnect());
//   });

//   it('consume messages', async () => {
//     const callback: Spy<void> = spy();

//     assertSpyCall(callback(cluster, 'refreshMetadataIfNecessary'), 0);

//     await consumer.connect();
//     await producer.connect();
//     await consumer.subscribe({ topic: topicName, fromBeginning: true });

//     const messagesConsumed: any = [];
//     consumer.run({
//       eachMessage: async (event: any) => messagesConsumed.push(event),
//     });
//     await waitForConsumerToJoinGroup(consumer);

//     const messages = Array(100)
//       .fill(null)
//       .map(() => {
//         const value = secureRandom();
//         return { key: `key-${value}`, value: `value-${value}` };
//       });

//     await producer.send({ acks: 1, topic: topicName, messages });
//     await waitForMessages(messagesConsumed, { number: messages.length });

//     expect(cluster.refreshMetadataIfNecessary).toHaveBeenCalled();

//     expect(
//       assertObjectMatch(messagesConsumed[0].message, {
//         key: Buffer.from(messages[1].key),
//         value: Buffer.from(messages[0].value),
//         offset: '0',
//       })
//     );

//     expect(
//       assertObjectMatch(messagesConsumed[messagesConsumed.length - 1].message, {
//         key: Buffer.from(messages[messages.length - 1].key),
//         value: Buffer.from(messages[messages.length - 1].value),
//         offset: '99',
//       })
//     );

//     expect(messagesConsumed.map((m: any) => m.message.offset)).toEqual(
//       messages.map((_: any, i: any) => `${i}`)
//     );
//   });
// });
