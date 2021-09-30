//NEED DENO REPLACEMENTS
//import fs from 'fs' - don't need 
import execa from 'execa'
import uuid from 'uuid/v4'
import semver from 'semver'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
//END NEED DENO REPLACEMENTS
import { Cluster }  from '../src/cluster'
import waitFor from '../src/utils/waitFor'
import connectionBuilder from '../src/cluster/connectionBuilder'
import { Connection } from '../src/network/connection'
import { defaultSocketFactory } from '../src/network/socketFactory'

const socketFactory = defaultSocketFactory()
//HOW DO I FIX THIS ONE?
const {
  createLogger,
  LEVELS: { NOTHING },

} = require('../src/loggers')

import LoggerConsole from '../src/loggers/console'
import { Kafka } from '../index'


const newLogger = (opts = {}) =>
  createLogger(Object.assign({ level: NOTHING, logCreator: LoggerConsole }, opts))

const getHost = () => 'localhost'
const secureRandom = (length = 10) => `${(crypto as any).randomBytes(length).toString('hex')}-${process.pid}-${uuid()}`;

const plainTextBrokers = (host = getHost()) => [`${host}:9092`, `${host}:9095`, `${host}:9098`]
const sslBrokers = (host = getHost()) => [`${host}:9093`, `${host}:9096`, `${host}:9099`]
const saslBrokers = (host = getHost()) => [`${host}:9094`, `${host}:9097`, `${host}:9100`]

const connectionOpts = (opts = {}) => ({
  socketFactory,
  clientId: `test-${secureRandom()}`,
  connectionTimeout: 3000,
  logger: newLogger(),
  host: getHost(),
  port: 9092,
  ...opts,
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sslConnect... Remove this comment to see the full error message
const sslConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(connectionOpts(), {
    port: 9093,
    ssl: {
      servername: 'localhost',
      rejectUnauthorized: false,
      ca: [fs.readFileSync('./testHelpers/certs/cert-signed', 'utf-8')],
    },
  })

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslConnec... Remove this comment to see the full error message
const saslConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'plain',
      username: 'test',
      password: 'testtest',
    },
  })

const saslWrongConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'plain',
      username: 'wrong',
      password: 'wrong',
    },
  })

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslSCRAM2... Remove this comment to see the full error message
const saslSCRAM256ConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'scram-sha-256',
      username: 'testscram',
      password: 'testtestscram=256',
    },
  })

const saslSCRAM256WrongConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'scram-sha-256',
      username: 'wrong',
      password: 'wrong',
    },
  })

const saslSCRAM512ConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'scram-sha-512',
      username: 'testscram',
      password: 'testtestscram=512',
    },
  })

const saslSCRAM512WrongConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'scram-sha-512',
      username: 'wrong',
      password: 'wrong',
    },
  })

const saslOAuthBearerConnectionOpts = () =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  Object.assign(sslConnectionOpts(), {
    port: 9094,
    sasl: {
      mechanism: 'oauthbearer',
      oauthBearerProvider: () => {
        const token = jwt.sign({ sub: 'test' }, 'abc', { algorithm: 'none' })

        return {
          value: token,
        }
      },
    },
  })

/**
 * List of the possible SASL setups.
 * OAUTHBEARER must be enabled as a special case.
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslEntrie... Remove this comment to see the full error message
const saslEntries = []
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
if (process.env['OAUTHBEARER_ENABLED'] !== '1') {
  saslEntries.push({
    name: 'PLAIN',
    opts: saslConnectionOpts,
    wrongOpts: saslWrongConnectionOpts,
    expectedErr: /SASL PLAIN authentication failed/,
  })

  saslEntries.push({
    name: 'SCRAM 256',
    opts: saslSCRAM256ConnectionOpts,
    wrongOpts: saslSCRAM256WrongConnectionOpts,
    expectedErr: /SASL SCRAM SHA256 authentication failed/,
  })

  saslEntries.push({
    name: 'SCRAM 512',
    opts: saslSCRAM512ConnectionOpts,
    wrongOpts: saslSCRAM512WrongConnectionOpts,
    expectedErr: /SASL SCRAM SHA512 authentication failed/,
  })
} else {
  saslEntries.push({
    name: 'OAUTHBEARER',
    opts: saslOAuthBearerConnectionOpts,
  })
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const createConnection = (opts = {}) => new Connection(Object.assign(connectionOpts(), opts))

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const createConnectionBuilder = (opts = {}, brokers = plainTextBrokers()) => {
  return connectionBuilder({
    socketFactory,
    logger: newLogger(),
    brokers,
    connectionTimeout: 1000,
    ...connectionOpts(),
    ...opts,
  })
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const createCluster = (opts = {}, brokers = plainTextBrokers()) =>
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  new Cluster(Object.assign(connectionOpts(), opts, { brokers }))

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createModP... Remove this comment to see the full error message
const createModPartitioner = () => ({
  partitionMetadata,
  message
}: any) => {
  const numPartitions = partitionMetadata.length
  const key = parseInt(message.key.replace(/[^\d]/g, ''), 10)
  return ((key || 0) % 3) % numPartitions
}

const testWaitFor = async (fn: any, opts = {}) => waitFor(fn, { ignoreTimeout: true, ...opts })

/**
 * @param {import("../types").KafkaJSError} errorType
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 * @template T
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'retryProto... Remove this comment to see the full error message
const retryProtocol = (errorType: any, fn: any) =>
  waitFor(
    async () => {
      try {
        return await fn()
      } catch (e) {
        if (e.type !== errorType) {
          throw e
        }
        return false
      }
    },
    { ignoreTimeout: true }
  )

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForMes... Remove this comment to see the full error message
const waitForMessages = (buffer: any, { number = 1, delay = 50 } = {}) =>
  waitFor(() => (buffer.length >= number ? buffer : false), { delay, ignoreTimeout: true })

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForNex... Remove this comment to see the full error message
const waitForNextEvent = (consumer: any, eventName: any, { maxWait = 10000 } = {}) =>
  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  new Promise((resolve: any, reject: any) => {
    const timeoutId = setTimeout(
      () => reject(new Error(`Timeout waiting for '${eventName}'`)),
      maxWait
    )
    consumer.on(eventName, (event: any) => {
      clearTimeout(timeoutId)
      resolve(event)
    })
    consumer.on(consumer.events.CRASH, (event: any) => {
      clearTimeout(timeoutId)
      reject(event.payload.error)
    })
  })

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
const waitForConsumerToJoinGroup = (consumer: any, { maxWait = 10000, label = '' } = {}) =>
  // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
  new Promise((resolve: any, reject: any) => {
    const timeoutId = setTimeout(() => {
      consumer.disconnect().then(() => {
        reject(new Error(`Timeout ${label}`.trim()))
      })
    }, maxWait)
    consumer.on(consumer.events.GROUP_JOIN, (event: any) => {
      clearTimeout(timeoutId)
      resolve(event)
    })
    consumer.on(consumer.events.CRASH, (event: any) => {
      clearTimeout(timeoutId)
      consumer.disconnect().then(() => {
        reject(event.payload.error)
      })
    })
  })

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
const createTopic = async ({
  topic,
  partitions = 1,
  replicas = 1,
  config = []
}: any) => {
  const kafka = new Kafka({ clientId: 'testHelpers', brokers: [`${getHost()}:9092`] })
  const admin = kafka.admin()

  try {
    await admin.connect()
    await admin.createTopics({
      waitForLeaders: true,
      topics: [
        { topic, numPartitions: partitions, replicationFactor: replicas, configEntries: config },
      ],
    })
  } finally {
    admin && (await admin.disconnect())
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'addPartiti... Remove this comment to see the full error message
const addPartitions = async ({
  topic,
  partitions
}: any) => {
  const cmd = `TOPIC=${topic} PARTITIONS=${partitions} ./scripts/addPartitions.sh`
  const cluster = createCluster()

  await cluster.connect()
  await cluster.addTargetTopic(topic)

  execa.commandSync(cmd, { shell: true })

  waitFor(async () => {
    await cluster.refreshMetadata()
    const partitionMetadata = cluster.findTopicPartitionMetadata(topic)
    return partitionMetadata.length === partitions
  })
}

const testIfKafkaVersion = (version: any, versionComparator: any) => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  const scopedTest = (description: any, callback: any, testFn = test) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    return versionComparator(semver.coerce(process.env.KAFKA_VERSION), semver.coerce(version))
      ? testFn(description, callback)
      : // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
        test.skip(description, callback)
  }

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  scopedTest.only = (description: any, callback: any) => scopedTest(description, callback, test.only)

  return scopedTest
}

const testIfKafkaVersionLTE = (version: any) => testIfKafkaVersion(version, semver.lte)
const testIfKafkaVersionGTE = (version: any) => testIfKafkaVersion(version, semver.gte)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
const testIfKafkaAtMost_0_10 = testIfKafkaVersionLTE('0.10')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
const testIfKafkaAtLeast_0_11 = testIfKafkaVersionGTE('0.11')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testIfKafk... Remove this comment to see the full error message
const testIfKafkaAtLeast_1_1_0 = testIfKafkaVersionGTE('1.1')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
const flakyTest = (description: any, callback: any, testFn = test) =>
  testFn(`[flaky] ${description}`, callback)
// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
flakyTest.skip = (description: any, callback: any) => flakyTest(description, callback, test.skip)
// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
flakyTest.only = (description: any, callback: any) => flakyTest(description, callback, test.only)
// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
const describeIfEnv = (key: any, value: any) => (description: any, callback: any, describeFn = describe) => {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  return value === process.env[key]
    ? describeFn(description, callback)
    : // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe.skip(description, callback)
}

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
const describeIfNotEnv = (key: any, value: any) => (description: any, callback: any, describeFn = describe) => {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  return value !== process.env[key]
    ? describeFn(description, callback)
    : // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe.skip(description, callback)
}

/**
 * Conditional describes for SASL OAUTHBEARER.
 * OAUTHBEARER must be enabled as a special case as current Kafka impl
 * doesn't allow it to be enabled aside of other SASL mechanisms.
 */
const describeIfOauthbearerEnabled = describeIfEnv('OAUTHBEARER_ENABLED', '1')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'describeIf... Remove this comment to see the full error message
const describeIfOauthbearerDisabled = describeIfNotEnv('OAUTHBEARER_ENABLED', '1')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unsupporte... Remove this comment to see the full error message
const unsupportedVersionResponse = () => Buffer.from({ type: 'Buffer', data: [0, 35, 0, 0, 0, 0] })
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'unsupporte... Remove this comment to see the full error message
const unsupportedVersionResponseWithTimeout = () =>
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
  Buffer.from({ type: 'Buffer', data: [0, 0, 0, 0, 0, 35] })

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateMe... Remove this comment to see the full error message
const generateMessages = (options: any) => {
  const { prefix, number = 100 } = options || {}
  const prefixOrEmpty = prefix ? `-${prefix}` : ''

  return Array(number)
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
    .fill()
    .map((v: any, i: any) => {
      const value = secureRandom()
      return {
        key: `key${prefixOrEmpty}-${i}-${value}`,
        value: `value${prefixOrEmpty}-${i}-${value}`,
      }
    });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  secureRandom,
  connectionOpts,
  sslConnectionOpts,
  saslConnectionOpts,
  saslSCRAM256ConnectionOpts,
  saslSCRAM512ConnectionOpts,
  saslOAuthBearerConnectionOpts,
  saslEntries,
  createConnection,
  createConnectionBuilder,
  createCluster,
  createModPartitioner,
  plainTextBrokers,
  sslBrokers,
  saslBrokers,
  newLogger,
  retryProtocol,
  createTopic,
  waitFor: testWaitFor,
  waitForMessages,
  waitForNextEvent,
  waitForConsumerToJoinGroup,
  testIfKafkaAtMost_0_10,
  testIfKafkaAtLeast_0_11,
  testIfKafkaAtLeast_1_1_0,
  flakyTest,
  describeIfOauthbearerEnabled,
  describeIfOauthbearerDisabled,
  addPartitions,
  unsupportedVersionResponse,
  generateMessages,
  unsupportedVersionResponseWithTimeout,
}
