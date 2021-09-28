// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'connection... Remove this comment to see the full error message
const { connectionOpts, sslConnectionOpts } = require('../../testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sleep'.
const sleep = require('../utils/sleep')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requests'.
const { requests } = require('../protocol/requests')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../protocol/decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../protocol/encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSReq... Remove this comment to see the full error message
const { KafkaJSRequestTimeoutError } = require('../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Connection... Remove this comment to see the full error message
const Connection = require('./connection')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONNECTION... Remove this comment to see the full error message
const { CONNECTION_STATUS } = require('./connectionStatus')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventEmitt... Remove this comment to see the full error message
const EventEmitter = require('events')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Network > Connection', () => {
  const invalidHost = 'kafkajs.test'
  let connection: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    connection && (await connection.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#connect', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('PLAINTEXT', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(() => {
        connection = new Connection(connectionOpts())
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('resolves the Promise when connected', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.connect()).resolves.toEqual(true)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.connected).toEqual(true)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('rejects the Promise in case of errors', async () => {
        connection.host = invalidHost
        const messagePattern = /Connection error: getaddrinfo ENOTFOUND kafkajs.test/
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.connect()).rejects.toThrow(messagePattern)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.connected).toEqual(false)
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('SSL', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(() => {
        connection = new Connection(sslConnectionOpts())
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('resolves the Promise when connected', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.connect()).resolves.toEqual(true)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.connected).toEqual(true)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('rejects the Promise in case of timeouts', async () => {
        const socketFactory = () => {
          const socket = new EventEmitter()
          socket.end = () => {}
          socket.unref = () => {}
          return socket
        }
        connection = new Connection({
          ...sslConnectionOpts({ connectionTimeout: 1 }),
          socketFactory,
        })

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.connect()).rejects.toHaveProperty('message', 'Connection timeout')
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.connected).toEqual(false)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('rejects the Promise in case of errors', async () => {
        connection.ssl.cert = 'invalid'
        const messagePattern = /Failed to connect/
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.connect()).rejects.toThrow(messagePattern)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(connection.connected).toEqual(false)
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#disconnect', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      connection = new Connection(connectionOpts())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('disconnects an active connection', async () => {
      await connection.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.connected).toEqual(true)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(connection.disconnect()).resolves.toEqual(true)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.connected).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('trigger "end" and "unref" function on not active connection', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.connected).toEqual(false)
      connection.socket = {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        end: jest.fn(),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        unref: jest.fn(),
      }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(connection.disconnect()).resolves.toEqual(true)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.socket.end).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.socket.unref).toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#send', () => {
    let apiVersions: any, metadata: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      connection = new Connection(connectionOpts())
      apiVersions = requests.ApiVersions.protocol({ version: 0 })
      metadata = requests.Metadata.protocol({ version: 0 })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('resolves the Promise with the response', async () => {
      await connection.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(connection.send(apiVersions())).resolves.toBeTruthy()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('rejects the Promise if it is not connected', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.connected).toEqual(false)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(connection.send(apiVersions())).rejects.toEqual(new Error('Not connected'))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('rejects the Promise in case of a non-retriable error', async () => {
      const protocol = {
        ...apiVersions(),
        response: {
          ...apiVersions().response,
          parse: () => {
            throw new Error('non-retriable')
          },
        },
      }

      await connection.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(connection.send(protocol)).rejects.toEqual(new Error('non-retriable'))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('respect the maxInFlightRequests', async () => {
      const protocol = apiVersions()
      connection = new Connection(connectionOpts({ maxInFlightRequests: 2 }))
      const originalProcessData = connection.processData

      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      connection.processData = async (data: any) => {
        await sleep(100)
        originalProcessData.apply(connection, [data])
      }

      await connection.connect()

      const requests = [
        connection.send(protocol),
        connection.send(protocol),
        connection.send(protocol),
      ]

      await sleep(50)

      const inFlightRequestsSize = connection.requestQueue.inflight.size
      const pendingRequestsSize = connection.requestQueue.pending.length

      // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
      await Promise.all(requests)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(inFlightRequestsSize).toEqual(2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(pendingRequestsSize).toEqual(1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('respect the requestTimeout', async () => {
      const protocol = apiVersions()
      connection = new Connection(
        connectionOpts({
          requestTimeout: 50,
          enforceRequestTimeout: true,
        })
      )
      const originalProcessData = connection.processData

      // @ts-expect-error ts-migrate(2705) FIXME: An async function or method in ES5/ES3 requires th... Remove this comment to see the full error message
      connection.processData = async (data: any) => {
        await sleep(100)
        originalProcessData.apply(connection, [data])
      }

      await connection.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(connection.send(protocol)).rejects.toThrowError(KafkaJSRequestTimeoutError)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throttles the request queue', async () => {
      const clientSideThrottleTime = 500
      // Create a fictitious request with a response that indicates client-side throttling is needed
      const protocol = {
        request: {
          apiKey: -1,
          apiVersion: 0,
          expectResponse: () => true,
          encode: () => new Encoder(),
        },
        response: {
          decode: () => ({ clientSideThrottleTime }),
          parse: () => ({}),
        },
      }

      // Setup the socket connection to accept the request
      const correlationId = 383
      connection.nextCorrelationId = () => correlationId
      connection.connectionStatus = CONNECTION_STATUS.CONNECTED
      connection.socket = {
        write() {
          // Simulate a happy response
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'setImmediate'.
          setImmediate(() => {
            connection.requestQueue.fulfillRequest({ correlationId, size: 0, payload: null })
          })
        },
        end() {},
        unref() {},
      }
      const before = Date.now()
      await connection.send(protocol)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.requestQueue.throttledUntil).toBeGreaterThanOrEqual(
        before + clientSideThrottleTime
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Debug logging', () => {
      let initialValue: any, connection: any

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeAll'.
      beforeAll(() => {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        initialValue = process.env.KAFKAJS_DEBUG_PROTOCOL_BUFFERS
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterAll'.
      afterAll(() => {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.env['KAFKAJS_DEBUG_PROTOCOL_BUFFERS'] = initialValue
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
      afterEach(async () => {
        connection && (await connection.disconnect())
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('logs the full payload in case of non-retriable error when "KAFKAJS_DEBUG_PROTOCOL_BUFFERS" runtime flag is set', async () => {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.env['KAFKAJS_DEBUG_PROTOCOL_BUFFERS'] = '1'
        connection = new Connection(connectionOpts())
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const debugStub = jest.fn()
        connection.logger.debug = debugStub
        const protocol = apiVersions()
        protocol.response.parse = () => {
          throw new Error('non-retriable')
        }
        await connection.connect()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.send(protocol)).rejects.toBeTruthy()

        const lastCall = debugStub.mock.calls[debugStub.mock.calls.length - 1]
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(lastCall[1].payload).toEqual(expect.any(Buffer))
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('filters payload in case of non-retriable error when "KAFKAJS_DEBUG_PROTOCOL_BUFFERS" runtime flag is not set', async () => {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        delete process.env['KAFKAJS_DEBUG_PROTOCOL_BUFFERS']
        connection = new Connection(connectionOpts())
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const debugStub = jest.fn()
        connection.logger.debug = debugStub
        const protocol = apiVersions()
        protocol.response.parse = () => {
          throw new Error('non-retriable')
        }
        await connection.connect()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.send(protocol)).rejects.toBeTruthy()

        const lastCall = debugStub.mock.calls[debugStub.mock.calls.length - 1]
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(lastCall[1].payload).toEqual({
          type: 'Buffer',
          data: '[filtered]',
        })
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Error logging', () => {
      let connection: any, errorStub: any

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(() => {
        connection = new Connection(connectionOpts())
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        errorStub = jest.fn()
        connection.logger.error = errorStub
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
      afterEach(async () => {
        connection && (await connection.disconnect())
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('logs error responses by default', async () => {
        const protocol = metadata({ topics: [] })
        protocol.response.parse = () => {
          throw new Error('non-retriable')
        }

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(protocol.logResponseError).not.toBe(false)

        await connection.connect()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.send(protocol)).rejects.toBeTruthy()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(errorStub).toHaveBeenCalled()
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not log errors when protocol.logResponseError=false', async () => {
        const protocol = metadata({ topics: [] })
        protocol.response.parse = () => {
          throw new Error('non-retriable')
        }
        protocol.logResponseError = false
        await connection.connect()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(connection.send(protocol)).rejects.toBeTruthy()

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(errorStub).not.toHaveBeenCalled()
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#nextCorrelationId', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      connection = new Connection(connectionOpts())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('increments the current correlationId', () => {
      const id1 = connection.nextCorrelationId()
      const id2 = connection.nextCorrelationId()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(id1).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(id2).toEqual(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.correlationId).toEqual(2)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('resets to 0 when correlationId is equal to Number.MAX_VALUE', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.correlationId).toEqual(0)

      connection.nextCorrelationId()
      connection.nextCorrelationId()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.correlationId).toEqual(2)

      connection.correlationId = Number.MAX_VALUE
      const id1 = connection.nextCorrelationId()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(id1).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.correlationId).toEqual(1)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#processData', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      connection = new Connection(connectionOpts())
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('buffer data while it is not complete', () => {
      const correlationId = 1
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const resolve = jest.fn()
      const entry = { correlationId, resolve }

      connection.requestQueue.push({
        entry,
        expectResponse: true,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        sendRequest: jest.fn(),
      })

      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const payload = Buffer.from('ab')
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const size = Buffer.byteLength(payload) + Decoder.int32Size()
      // expected response size
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const sizePart1 = Buffer.from([0, 0])
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const sizePart2 = Buffer.from([0, 6])

      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const correlationIdPart1 = Buffer.from([0, 0])
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const correlationIdPart2 = Buffer.from([0])
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const correlationIdPart3 = Buffer.from([1])

      // write half of the expected size and expect to keep buffering
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.processData(sizePart1)).toBeUndefined()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolve).not.toHaveBeenCalled()

      // Write the rest of the size, but without any response
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.processData(sizePart2)).toBeUndefined()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolve).not.toHaveBeenCalled()

      // Response consists of correlation id + payload
      // Writing 1/3 of the correlation id
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.processData(correlationIdPart1)).toBeUndefined()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolve).not.toHaveBeenCalled()

      // At this point, we will write N bytes, where N == size,
      // but we should keep buffering because the size field should
      // not be considered as part of the response payload
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(connection.processData(correlationIdPart2)).toBeUndefined()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolve).not.toHaveBeenCalled()

      // write full payload size
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
      const buffer = Buffer.concat([correlationIdPart3, payload])
      connection.processData(buffer)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolve).toHaveBeenCalledWith({
        correlationId,
        size,
        entry,
        payload,
      })
    })
  })
})
