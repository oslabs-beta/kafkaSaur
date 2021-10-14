const {
  createConnectionBuilder,
  plainTextBrokers,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
  createConnection,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
const { KafkaJSProtocolError, KafkaJSConnectionError } = require('../../errors')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createErro... Remove this comment to see the full error message
const { createErrorFromCode, errorCodes } = require('../../protocol/error')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BrokerPool... Remove this comment to see the full error message
const BrokerPool = require('../brokerPool')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../../broker')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > BrokerPool', () => {
  let topicName: any, brokerPool: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    brokerPool = new BrokerPool({
      connectionBuilder: createConnectionBuilder(),
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    brokerPool && (await brokerPool.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('defaults metadataMaxAge to 0', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(brokerPool.metadataMaxAge).toEqual(0)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#connect', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when the broker pool is created seed broker is null', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker).toEqual(undefined)
      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.isConnected()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('load the versions from the seed broker', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.versions).toEqual(null)
      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.versions).toEqual(brokerPool.seedBroker.versions)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('select a different seed broker on ILLEGAL_SASL_STATE error', async () => {
      await brokerPool.createSeedBroker()

      const originalSeedPort = brokerPool.seedBroker.connection.port
      const illegalStateError = new KafkaJSProtocolError({
        message: 'ILLEGAL_SASL_STATE',
        type: 'ILLEGAL_SASL_STATE',
        code: 34,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      brokerPool.seedBroker.connect = jest.fn(() => {
        throw illegalStateError
      })

      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.connection.port).not.toEqual(originalSeedPort)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('select a different seed broker on connection errors', async () => {
      await brokerPool.createSeedBroker()

      const originalSeedPort = brokerPool.seedBroker.connection.port
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      brokerPool.seedBroker.connect = jest.fn(() => {
        throw new KafkaJSConnectionError('Test connection error')
      })

      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.connection.port).not.toEqual(originalSeedPort)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not connect to the seed broker if it is already connected', async () => {
      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.isConnected()).toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      jest.spyOn(brokerPool.seedBroker, 'connect')
      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.connect).not.toHaveBeenCalled()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not connect to the seed broker if it has connected brokers', async () => {
      await brokerPool.connect()
      await brokerPool.refreshMetadata([topicName])

      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      const broker = Object.values(brokerPool.brokers).find((broker: any) => !broker.isConnected())
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).not.toEqual(brokerPool.seedBroker)

      await broker.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)

      await brokerPool.seedBroker.disconnect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.isConnected()).toEqual(false)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      jest.spyOn(brokerPool.seedBroker, 'connect')
      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.connect).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#disconnect', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await brokerPool.connect()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disconnects the seed broker', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.isConnected()).toEqual(true)
      await brokerPool.disconnect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.isConnected()).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disconnects all brokers in the broker pool', async () => {
      await brokerPool.refreshMetadata([topicName])
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      const brokers = Object.values(brokerPool.brokers)

      for (const broker of brokers) {
        await brokerPool.connectBroker(broker)
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(true)
      await brokerPool.disconnect()

      for (const broker of brokers) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(broker.isConnected()).toEqual(false)
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('erases metadata and broker pool information', async () => {
      await brokerPool.refreshMetadata([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadata).not.toEqual(null)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.versions).not.toEqual(null)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.brokers).not.toEqual({})

      await brokerPool.disconnect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadata).toEqual(null)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.versions).toEqual(null)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.brokers).toEqual({})
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeBroker', () => {
    let host: any, port: any

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await brokerPool.connect()
      await brokerPool.refreshMetadata([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Object.values(brokerPool.brokers).length).toBeGreaterThan(1)

      const brokerUri = plainTextBrokers().shift()
      const [hostToRemove, portToRemove] = brokerUri.split(':')
      host = hostToRemove
      port = Number(portToRemove)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('removes the broker by host and port', () => {
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      const numberOfBrokers = Object.values(brokerPool.brokers).length

      brokerPool.removeBroker({ host, port })

      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      const brokers = Object.values(brokerPool.brokers)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokers.length).toEqual(numberOfBrokers - 1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(
        brokers.find((broker: any) => broker.connection.host === host && broker.connection.port === port)
      ).toEqual(undefined)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('replaces the seed broker if it is the target broker', () => {
      const seedBrokerHost = brokerPool.seedBroker.connection.host
      const seedBrokerPort = brokerPool.seedBroker.connection.port
      brokerPool.removeBroker({ host: seedBrokerHost, port: seedBrokerPort })

      // check only port since the host will be "localhost" on most tests
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.seedBroker.connection.port).not.toEqual(seedBrokerPort)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('erases metadataExpireAt to force a metadata refresh', () => {
      brokerPool.metadataExpireAt = Date.now() + 25
      brokerPool.removeBroker({ host, port })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadataExpireAt).toEqual(null)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasConnectedBrokers', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true if the seed broker is connected', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(false)
      await brokerPool.connect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true if any of the brokers are connected', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(false)
      await brokerPool.connect()
      await brokerPool.refreshMetadata([topicName])

      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      const broker = Object.values(brokerPool.brokers).find((broker: any) => !broker.isConnected())
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).not.toEqual(brokerPool.seedBroker)

      await broker.connect()
      await brokerPool.seedBroker.disconnect()

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when nothing is connected', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(false)
      await brokerPool.connect()
      await brokerPool.disconnect()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.hasConnectedBrokers()).toEqual(false)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#refreshMetadata', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await brokerPool.connect()
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates the metadata object', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadata).toEqual(null)
      await brokerPool.refreshMetadata([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadata).not.toEqual(null)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates the list of brokers', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.brokers).toEqual({})
      await brokerPool.refreshMetadata([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Object.keys(brokerPool.brokers).sort()).toEqual(['0', '1', '2'])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Object.values(brokerPool.brokers)).toEqual(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.arrayContaining([expect.any(Broker), expect.any(Broker), expect.any(Broker)])
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('includes the seed broker into the broker pool', async () => {
      await brokerPool.refreshMetadata([topicName])
      const seed = brokerPool.seedBroker.connection
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      const brokers = Object.values(brokerPool.brokers)
      const seedFromBrokerPool = brokers
        .map((b: any) => b.connection)
        .find((b: any) => b.host === seed.host && b.port === seed.port)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(seedFromBrokerPool).toEqual(seed)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('cleans up unused brokers', async () => {
      await brokerPool.refreshMetadata([topicName])

      const nodeId = 'fakebroker'
      const fakeBroker = new Broker({
        connection: createConnection(),
        logger: newLogger(),
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      jest.spyOn(fakeBroker, 'disconnect')
      brokerPool.brokers[nodeId] = fakeBroker
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Object.keys(brokerPool.brokers)).toEqual(['0', '1', '2', 'fakebroker'])

      await brokerPool.refreshMetadata([topicName])

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(fakeBroker.disconnect).toHaveBeenCalled()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Object.keys(brokerPool.brokers)).toEqual(['0', '1', '2'])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('retries on LEADER_NOT_AVAILABLE errors', async () => {
      const leaderNotAvailableError = new KafkaJSProtocolError({
        message: 'LEADER_NOT_AVAILABLE',
        type: 'LEADER_NOT_AVAILABLE',
        code: 5,
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      brokerPool.findConnectedBroker = jest.fn(() => brokerPool.seedBroker)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      jest.spyOn(brokerPool.seedBroker, 'metadata').mockImplementationOnce(() => {
        throw leaderNotAvailableError
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadata).toEqual(null)
      await brokerPool.refreshMetadata([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.metadata).not.toEqual(null)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when replacing nodeIds with different host/port/rack', () => {
      let lastBroker: any

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
      beforeEach(async () => {
        await brokerPool.refreshMetadata([topicName])
        lastBroker = brokerPool.brokers[Object.keys(brokerPool.brokers).length - 1]
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        jest.spyOn(brokerPool, 'findConnectedBroker').mockImplementation(() => lastBroker)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('replaces the broker when the host change', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        jest.spyOn(lastBroker, 'metadata').mockImplementationOnce(() => ({
          ...brokerPool.metadata,
          brokers: brokerPool.metadata.brokers.map((broker: any) => broker.nodeId === 0 ? { ...broker, host: '0.0.0.0' } : broker
          ),
        }))

        await brokerPool.refreshMetadata([topicName])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(brokerPool.brokers[0].connection.host).toEqual('0.0.0.0')
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('replaces the broker when the port change', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        jest.spyOn(lastBroker, 'metadata').mockImplementationOnce(() => ({
          ...brokerPool.metadata,
          brokers: brokerPool.metadata.brokers.map((broker: any) => broker.nodeId === 0 ? { ...broker, port: 4321 } : broker
          ),
        }))

        await brokerPool.refreshMetadata([topicName])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(brokerPool.brokers[0].connection.port).toEqual(4321)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('replaces the broker when the rack change', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        jest.spyOn(lastBroker, 'metadata').mockImplementationOnce(() => ({
          ...brokerPool.metadata,
          brokers: brokerPool.metadata.brokers.map((broker: any) => broker.nodeId === 0 ? { ...broker, rack: 'south-1' } : broker
          ),
        }))

        await brokerPool.refreshMetadata([topicName])
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(brokerPool.brokers[0].connection.rack).toEqual('south-1')
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#refreshMetadataIfNecessary', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      brokerPool.refreshMetadata = jest.fn()
      brokerPool.metadataMaxAge = 1
      brokerPool.metadata = {
        topicMetadata: [],
      }
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls refreshMetadata if metadataExpireAt is not defined', async () => {
      brokerPool.metadataExpireAt = null
      await brokerPool.refreshMetadataIfNecessary([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.refreshMetadata).toHaveBeenCalledWith([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls refreshMetadata if metadata is not initialized', async () => {
      brokerPool.metadataExpireAt = Date.now() + 1000
      brokerPool.metadata = null
      await brokerPool.refreshMetadataIfNecessary([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.refreshMetadata).toHaveBeenCalledWith([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls refreshMetadata if metadata is expired', async () => {
      brokerPool.metadataExpireAt = Date.now() - 1000
      await brokerPool.refreshMetadataIfNecessary([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.refreshMetadata).toHaveBeenCalledWith([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls refreshMetadata if metadata is not present', async () => {
      brokerPool.metadataExpireAt = Date.now() + 1000
      await brokerPool.refreshMetadataIfNecessary([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.refreshMetadata).toHaveBeenCalledWith([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not call refreshMetadata if metadata is valid and up to date', async () => {
      brokerPool.metadataExpireAt = Date.now() + 1000
      brokerPool.metadata = {
        topicMetadata: [
          {
            topic: topicName,
          },
        ],
      }
      await brokerPool.refreshMetadataIfNecessary([topicName])
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.refreshMetadata).not.toHaveBeenCalled()
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findBroker', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await brokerPool.refreshMetadata([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finds a broker by nodeId', async () => {
      const nodeId = Object.keys(brokerPool.brokers)[0]
      const broker = await brokerPool.findBroker({ nodeId })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).toEqual(brokerPool.brokers[nodeId])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('connects the broker if it is not connected', async () => {
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'find' does not exist on type 'string[]'.... Remove this comment to see the full error message
      const nodeId = Object.keys(brokerPool.brokers).find(
        (id: any) => !brokerPool.brokers[id].isConnected()
      )
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(brokerPool.brokers[nodeId].isConnected()).toEqual(false)

      const broker = await brokerPool.findBroker({ nodeId })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('recreates the connection on ILLEGAL_SASL_STATE error', async () => {
      const nodeId = 'fakebroker'
      const mockBroker = new Broker({
        connection: createConnection(),
        logger: newLogger(),
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      jest.spyOn(mockBroker, 'connect').mockImplementationOnce(() => {
        throw createErrorFromCode(errorCodes.find(({
          type
        }: any) => type === 'ILLEGAL_SASL_STATE').code)
      })
      brokerPool.brokers[nodeId] = mockBroker

      const broker = await brokerPool.findBroker({ nodeId })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error when the broker is not found', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(brokerPool.findBroker({ nodeId: 627 })).rejects.toHaveProperty(
        'message',
        'Broker 627 not found in the cached metadata'
      )
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#withBroker', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await brokerPool.refreshMetadata([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if there are no brokers configured', async () => {
      brokerPool.brokers = {}
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(brokerPool.withBroker(jest.fn())).rejects.toHaveProperty(
        'message',
        'No brokers in the broker pool'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the result of the callback', async () => {
      const output = 'return-from-callback'
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const callback = jest.fn(() => output)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(brokerPool.withBroker(callback)).resolves.toEqual(output)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(callback).toHaveBeenCalledWith(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect.objectContaining({
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          nodeId: expect.any(String),
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          broker: expect.any(Broker),
        })
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns null if the callback never resolves', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const callback = jest.fn(() => {
        throw new Error('never again!')
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(brokerPool.withBroker(callback)).resolves.toEqual(null)
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findConnectedBroker', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      await brokerPool.refreshMetadata([topicName])
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns a connected broker if it is available', async () => {
      const broker = await brokerPool.findConnectedBroker()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).toBeInstanceOf(Broker)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns a known broker connecting it in the process', async () => {
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      for (const broker of Object.values(brokerPool.brokers)) {
        await broker.disconnect()
      }

      const broker = await brokerPool.findConnectedBroker()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).toBeInstanceOf(Broker)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the seed broker if no other broker is available', async () => {
      brokerPool.brokers = {}
      const broker = await brokerPool.findConnectedBroker()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).toEqual(brokerPool.seedBroker)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('connects the seed broker if needed', async () => {
      brokerPool.brokers = {}
      await brokerPool.seedBroker.disconnect()

      const broker = await brokerPool.findConnectedBroker()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker).toEqual(brokerPool.seedBroker)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(broker.isConnected()).toEqual(true)
    })
  })
})
