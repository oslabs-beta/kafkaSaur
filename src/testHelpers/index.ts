//WORK IN PROGRESS

// //TINCAN - JEST REPLACEMENT
// import {
//   beforeEach,
//   describe,
//   expect,
//   it,
//   run,
// } from 'https://deno.land/x/tincan/mod.ts'; //https://deno.land/x/tincan@0.2.2/mod.ts
// //DENO REPLACEMENTS - commented out original imports
// //import fs from 'fs' - don't need - use Deno.readFileSync
// //import execa from 'execa' - replaced with Deno.run inside of addpartitions
// //import uuid from 'uuid/v4' - replaced with deno std below
// import { v4 } from 'https://deno.land/std@0.111.0/uuid/mod.ts';
// //import semver from 'semver' - replaced w deno version of same package below
// import * as semver from 'https://deno.land/x/semver/mod.ts';
// import crypto from 'https://deno.land/std@0.110.0/node/crypto.ts';
// import process from 'https://deno.land/std@0.110.0/node/process.ts';

// //import jwt from 'jsonwebtoken' - replaced with 3rd part djwt, modified below usage slightly
// import { create } from 'https://deno.land/x/djwt@v2.4/mod.ts';
// import { Buffer } from 'https://deno.land/std@0.110.0/node/buffer.ts';
// //END NEED DENO REPLACEMENTS

// import { Cluster } from '../src/cluster/index.ts';
// import waitFor from '../src/utils/waitFor.ts';
// import connectionBuilder from '../src/cluster/connectionBuilder.ts';
// import Connection from '../src/network/connection.ts';
// import defaultSocketFactory from '../src/network/socketFactory.ts';

// const socketFactory = defaultSocketFactory();

// // const {
// //   createLogger,
// //   LEVELS: { NOTHING },
// // } = require('../src/loggers')

// import * as lg from '../src/loggers/index.ts';
// const {
//   createLogger,
//   LEVELS: { NOTHING },
// } = lg;

// import LoggerConsole from '../src/loggers/console.ts';
// import { Kafka } from '../index.ts';

// const newLogger = (opts = {}) =>
//   createLogger(
//     Object.assign({ level: NOTHING, logCreator: LoggerConsole }, opts)
//   );

// const getHost = () => 'localhost';
// const secureRandom = (length = 10) =>
//   `${(crypto as any).randomBytes(length).toString('hex')}-${
//     process.pid
//   }-${v4.generate()}`;

// const plainTextBrokers = (host = getHost()) => [
//   `${host}:9092`,
//   `${host}:9095`,
//   `${host}:9098`,
// ];
// const sslBrokers = (host = getHost()) => [
//   `${host}:9093`,
//   `${host}:9096`,
//   `${host}:9099`,
// ];
// const saslBrokers = (host = getHost()) => [
//   `${host}:9094`,
//   `${host}:9097`,
//   `${host}:9100`,
// ];

// const connectionOpts = (opts = {}) => ({
//   socketFactory,
//   clientId: `test-${secureRandom()}`,
//   connectionTimeout: 3000,
//   logger: newLogger(),
//   host: getHost(),
//   port: 9092,
//   ...opts,
// });

// // const sslConnectionOpts = () =>
// //   Object.assign(connectionOpts(), {
// //     port: 9093,
// //     ssl: {
// //       servername: 'localhost',
// //       rejectUnauthorized: false,
// //       ca: [Deno.readFileSync('./testHelpers/certs/cert-signed', 'utf-8')],
// //     },
// //   });

// // const saslConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'plain',
// //       username: 'test',
// //       password: 'testtest',
// //     },
// //   });

// // const saslWrongConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'plain',
// //       username: 'wrong',
// //       password: 'wrong',
// //     },
// //   });

// // const saslSCRAM256ConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'scram-sha-256',
// //       username: 'testscram',
// //       password: 'testtestscram=256',
// //     },
// //   });

// // const saslSCRAM256WrongConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'scram-sha-256',
// //       username: 'wrong',
// //       password: 'wrong',
// //     },
// //   });

// // const saslSCRAM512ConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'scram-sha-512',
// //       username: 'testscram',
// //       password: 'testtestscram=512',
// //     },
// //   });

// // const saslSCRAM512WrongConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'scram-sha-512',
// //       username: 'wrong',
// //       password: 'wrong',
// //     },
// //   });

// // const saslOAuthBearerConnectionOpts = () =>
// //   Object.assign(sslConnectionOpts(), {
// //     port: 9094,
// //     sasl: {
// //       mechanism: 'oauthbearer',
// //       oauthBearerProvider: async () => {
// //         //const token = jwt.sign({ sub: 'test' }, 'abc', { algorithm: 'none' });
// //         const token = await create(
// //           { alg: 'none', typ: 'JWT' },
// //           { sub: 'test' },
// //           'abc'
// //         );

// //         return {
// //           value: token,
// //         };
// //       },
// //     },
// //   });

// /**
//  * List of the possible SASL setups.
//  * OAUTHBEARER must be enabled as a special case.
//  */
// // const saslEntries = [];
// // if (process.env['OAUTHBEARER_ENABLED'] !== '1') {
// //   saslEntries.push({
// //     name: 'PLAIN',
// //     opts: saslConnectionOpts,
// //     wrongOpts: saslWrongConnectionOpts,
// //     expectedErr: /SASL PLAIN authentication failed/,
// //   });

// //   saslEntries.push({
// //     name: 'SCRAM 256',
// //     opts: saslSCRAM256ConnectionOpts,
// //     wrongOpts: saslSCRAM256WrongConnectionOpts,
// //     expectedErr: /SASL SCRAM SHA256 authentication failed/,
// //   });

// //   saslEntries.push({
// //     name: 'SCRAM 512',
// //     opts: saslSCRAM512ConnectionOpts,
// //     wrongOpts: saslSCRAM512WrongConnectionOpts,
// //     expectedErr: /SASL SCRAM SHA512 authentication failed/,
// //   });
// // }
// // else {
// //    saslEntries.push({
// //      name: 'OAUTHBEARER',
// //      opts: saslOAuthBearerConnectionOpts,
// //   // });
// // }

// const createConnection = (opts = {}) =>
//   new Connection(Object.assign(connectionOpts(), opts));

// // const createConnectionBuilder = (opts = {}, brokers = plainTextBrokers()) => {
// //   return connectionBuilder({
// //     socketFactory,
// //     logger: newLogger(),
// //     brokers,
// //     connectionTimeout: 1000,
// //     ,
// //     ...opts,
// //   });
// // };

// const createCluster = (opts = {}, brokers = plainTextBrokers()) =>
//   new Cluster(Object.assign(connectionOpts(), opts, { brokers }));

// const createModPartitioner =
//   () =>
//   ({ partitionMetadata, message }: any) => {
//     const numPartitions = partitionMetadata.length;
//     const key = parseInt(message.key.replace(/[^\d]/g, ''), 10);
//     return ((key || 0) % 3) % numPartitions;
//   };

// const testWaitFor = async (fn: any, opts = {}) =>
//   await waitFor(fn, { ignoreTimeout: true, ...opts });

// /**
//  * @param {import("../types").KafkaJSError} errorType
//  * @param {() => Promise<T>} fn
//  * @returns {Promise<T>}
//  * @template T
//  */
// const retryProtocol = (errorType: any, fn: any) =>
//   waitFor(
//     async () => {
//       try {
//         return await fn();
//       } catch (e) {
//         if (e.type !== errorType) {
//           throw e;
//         }
//         return false;
//       }
//     },
//     { ignoreTimeout: true }
//   );

// const waitForMessages = (buffer: any, { number = 1, delay = 50 } = {}) =>
//   waitFor(() => (buffer.length >= number ? buffer : false), {
//     delay,
//     ignoreTimeout: true,
//   });

// const waitForNextEvent = (
//   consumer: any,
//   eventName: any,
//   { maxWait = 10000 } = {}
// ) =>
//   new Promise((resolve: any, reject: any) => {
//     const timeoutId = setTimeout(
//       () => reject(new Error(`Timeout waiting for '${eventName}'`)),
//       maxWait
//     );
//     consumer.on(eventName, (event: any) => {
//       clearTimeout(timeoutId);
//       resolve(event);
//     });
//     consumer.on(consumer.events.CRASH, (event: any) => {
//       clearTimeout(timeoutId);
//       reject(event.payload.error);
//     });
//   });

// const waitForConsumerToJoinGroup = (
//   consumer: any,
//   { maxWait = 10000, label = '' } = {}
// ) =>
//   new Promise((resolve: any, reject: any) => {
//     const timeoutId = setTimeout(() => {
//       consumer.disconnect().then(() => {
//         reject(new Error(`Timeout ${label}`.trim()));
//       });
//     }, maxWait);
//     consumer.on(consumer.events.GROUP_JOIN, (event: any) => {
//       clearTimeout(timeoutId);
//       resolve(event);
//     });
//     consumer.on(consumer.events.CRASH, (event: any) => {
//       clearTimeout(timeoutId);
//       consumer.disconnect().then(() => {
//         reject(event.payload.error);
//       });
//     });
//   });

// const createTopic = async ({
//   topic,
//   partitions = 1,
//   replicas = 1,
//   config = [],
// }: any) => {
//   const kafka = new Kafka({
//     clientId: 'testHelpers',
//     brokers: [`${getHost()}:9092`],
//   });
//   const admin = kafka.admin();

//   try {
//     await admin.connect();
//     await admin.createTopics({
//       waitForLeaders: true,
//       topics: [
//         {
//           topic,
//           numPartitions: partitions,
//           replicationFactor: replicas,
//           configEntries: config,
//         },
//       ],
//     });
//   } finally {
//     admin && (await admin.disconnect());
//   }
// };

// const addPartitions = async ({ topic, partitions }: any) => {
//   //const cmd = `TOPIC=${topic} PARTITIONS=${partitions} ./scripts/addPartitions.sh`
//   const cluster = createCluster();

//   await cluster.connect();
//   await cluster.addTargetTopic(topic);

//   //execa.commandSync(cmd, { shell: true })
//   Deno.run({
//     cmd: [`TOPIC=${topic} PARTITIONS=${partitions} ./scripts/addPartitions.sh`],
//   });

//   waitFor(async () => {
//     await cluster.refreshMetadata();
//     const partitionMetadata = cluster.findTopicPartitionMetadata(topic);
//     return partitionMetadata.length === partitions;
//   });
// };

// const testIfKafkaVersion = (version: any, versionComparator: any) => {
//   const scopedTest = (description: any, callback: any, testFn = it) => {
//     return versionComparator(
//       semver.coerce(process.env.KAFKA_VERSION),
//       semver.coerce(version)
//     )
//       ? testFn(description, callback)
//       : it.skip(description, callback);
//   };

//   scopedTest.only = (description: any, callback: any) =>
//     scopedTest(description, callback, it.only as any);

//   return scopedTest;
// };

// const testIfKafkaVersionLTE = (version: any) =>
//   testIfKafkaVersion(version, semver.lte);
// const testIfKafkaVersionGTE = (version: any) =>
//   testIfKafkaVersion(version, semver.gte);

// const testIfKafkaAtMost_0_10 = testIfKafkaVersionLTE('0.10');
// const testIfKafkaAtLeast_0_11 = testIfKafkaVersionGTE('0.11');
// const testIfKafkaAtLeast_1_1_0 = testIfKafkaVersionGTE('1.1');

// const flakyTest = (description: any, callback: any, testFn = it) =>
//   testFn(`[flaky] ${description}`, callback);
// flakyTest.skip = (description: any, callback: any) =>
//   flakyTest(description, callback, it.skip as any);
// flakyTest.only = (description: any, callback: any) =>
//   flakyTest(description, callback, it.only as any);
// const describeIfEnv =
//   (key: any, value: any) =>
//   (description: any, callback: any, describeFn = describe) => {
//     return value === process.env[key]
//       ? describeFn(description, callback)
//       : it.skip(description, callback);
//   };

// const describeIfNotEnv =
//   (key: any, value: any) =>
//   (description: any, callback: any, describeFn = describe) => {
//     return value !== process.env[key]
//       ? describeFn(description, callback)
//       : describe.skip(description, callback);
//   };

// /**
//  * Conditional describes for SASL OAUTHBEARER.
//  * OAUTHBEARER must be enabled as a special case as current Kafka impl
//  * doesn't allow it to be enabled aside of other SASL mechanisms.
//  */
// const describeIfOauthbearerEnabled = describeIfEnv('OAUTHBEARER_ENABLED', '1');
// const describeIfOauthbearerDisabled = describeIfNotEnv(
//   'OAUTHBEARER_ENABLED',
//   '1'
// );

// const unsupportedVersionResponse = () =>
//   Buffer.from({ type: 'Buffer', data: [0, 35, 0, 0, 0, 0] } as any);
// const unsupportedVersionResponseWithTimeout = () =>
//   Buffer.from({ type: 'Buffer', data: [0, 0, 0, 0, 0, 35] } as any);

// const generateMessages = (options: any) => {
//   const { prefix, number = 100 } = options || {};
//   const prefixOrEmpty = prefix ? `-${prefix}` : '';

//   return Array(number)
//     .fill(undefined) //this was originally .fill(), typescript does not like but JS does
//     .map((v: any, i: any) => {
//       const value = secureRandom();
//       return {
//         key: `key${prefixOrEmpty}-${i}-${value}`,
//         value: `value${prefixOrEmpty}-${i}-${value}`,
//       };
//     });
// };

// export {
//   secureRandom,
//   // connectionOpts,
//   // sslConnectionOpts,
//   // saslConnectionOpts,
//   // saslSCRAM256ConnectionOpts,
//   // saslSCRAM512ConnectionOpts,
//   // saslOAuthBearerConnectionOpts,
//   // saslEntries,
//   // createConnection,
//   // createConnectionBuilder,
//   createCluster,
//   createModPartitioner,
//   // plainTextBrokers,
//   // sslBrokers,
//   // saslBrokers,
//   newLogger,
//   // retryProtocol,
//   createTopic,
//   //waitFor: testWaitFor,
//   // testWaitFor,
//   waitForMessages,
//   // waitForNextEvent,
//   waitForConsumerToJoinGroup,
//   // testIfKafkaAtMost_0_10,
//   // testIfKafkaAtLeast_0_11,
//   // testIfKafkaAtLeast_1_1_0,
//   // flakyTest,
//   // describeIfOauthbearerEnabled,
//   // describeIfOauthbearerDisabled,
//   // addPartitions,
//   // unsupportedVersionResponse,
//   // generateMessages,
//   // unsupportedVersionResponseWithTimeout,
// };
