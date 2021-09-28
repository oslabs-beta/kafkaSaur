// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createConn... Remove this comment to see the full error message
const { createConnection, connectionOpts, secureRandom, newLogger } = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Broker'.
const Broker = require('../index')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ACL_RESOUR... Remove this comment to see the full error message
const ACL_RESOURCE_TYPES = require('../../protocol/aclResourceTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ACL_OPERAT... Remove this comment to see the full error message
const ACL_OPERATION_TYPES = require('../../protocol/aclOperationTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ACL_PERMIS... Remove this comment to see the full error message
const ACL_PERMISSION_TYPES = require('../../protocol/aclPermissionTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RESOURCE_P... Remove this comment to see the full error message
const RESOURCE_PATTERN_TYPES = require('../../protocol/resourcePatternTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Broker > describeAcls', () => {
  let seedBroker: any, broker: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    seedBroker = new Broker({
      connection: createConnection(connectionOpts()),
      logger: newLogger(),
    })
    await seedBroker.connect()

    const metadata = await seedBroker.metadata()
    const newBrokerData = metadata.brokers.find((b: any) => b.nodeId === metadata.controllerId)

    broker = new Broker({
      connection: createConnection(newBrokerData),
      logger: newLogger(),
    })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect())
    broker && (await broker.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('request', async () => {
    await broker.connect()

    const topicName = `test-topic-${secureRandom()}`
    const principal = `User:bob-${secureRandom()}`
    const acl = {
      resourceType: ACL_RESOURCE_TYPES.TOPIC,
      resourceName: topicName,
      resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
      principal,
      host: '*',
      operation: ACL_OPERATION_TYPES.ALL,
      permissionType: ACL_PERMISSION_TYPES.ALLOW,
    }

    await broker.createAcls({ acl: [acl] })
    const response = await broker.describeAcls({
      // no principal
      resourceName: acl.resourceName,
      resourceType: acl.resourceType,
      host: acl.host,
      permissionType: acl.permissionType,
      operation: acl.operation,
      resourcePatternType: acl.resourcePatternType,
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(response).toEqual({
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
      errorMessage: null,
      resources: [
        {
          resourceType: ACL_RESOURCE_TYPES.TOPIC,
          resourceName: topicName,
          resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
          acls: [
            {
              principal,
              host: '*',
              operation: ACL_OPERATION_TYPES.ALL,
              permissionType: ACL_PERMISSION_TYPES.ALLOW,
            },
          ],
        },
      ],
    })
  })
})
