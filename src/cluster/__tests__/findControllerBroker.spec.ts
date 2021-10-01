// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
const { createCluster } = require('testHelpers')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSMet... Remove this comment to see the full error message
const { KafkaJSMetadataNotLoaded, KafkaJSBrokerNotFound } = require('../../errors')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Cluster > findControllerBroker', () => {
  let cluster: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    cluster = createCluster()
    cluster.brokerPool.metadata = { controllerId: '0' }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    cluster.findBroker = jest.fn()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('finds the broker of the controller', async () => {
    cluster.findBroker.mockImplementationOnce(() => true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findControllerBroker()).resolves.toEqual(true)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(cluster.findBroker).toHaveBeenCalledWith({ nodeId: '0' })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws KafkaJSTopicMetadataNotLoaded if metadata is not loaded', async () => {
    cluster.brokerPool.metadata = null
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findControllerBroker()).rejects.toThrow(KafkaJSMetadataNotLoaded)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws KafkaJSTopicMetadataNotLoaded if the controllerId is invalid', async () => {
    cluster.brokerPool.metadata = { controllerId: undefined }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findControllerBroker()).rejects.toThrow(KafkaJSMetadataNotLoaded)
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('throws KafkaJSBrokerNotFound if the node is not in the cache', async () => {
    cluster.findBroker.mockImplementationOnce(() => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      throw new KafkaJSBrokerNotFound('not found')
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(cluster.findControllerBroker()).rejects.toThrow(KafkaJSBrokerNotFound)
  })
})
