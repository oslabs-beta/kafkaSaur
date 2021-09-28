// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createAdmi... Remove this comment to see the full error message
const createAdmin = require('../index')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslConnec... Remove this comment to see the full error message
  saslConnectionOpts,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'saslBroker... Remove this comment to see the full error message
  saslBrokers,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ACL_RESOUR... Remove this comment to see the full error message
const ACL_RESOURCE_TYPES = require('../../protocol/aclResourceTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ACL_OPERAT... Remove this comment to see the full error message
const ACL_OPERATION_TYPES = require('../../protocol/aclOperationTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ACL_PERMIS... Remove this comment to see the full error message
const ACL_PERMISSION_TYPES = require('../../protocol/aclPermissionTypes')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RESOURCE_P... Remove this comment to see the full error message
const RESOURCE_PATTERN_TYPES = require('../../protocol/resourcePatternTypes')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Admin', () => {
  let admin: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    admin = createAdmin({
      logger: newLogger(),
      cluster: createCluster(
        {
          ...saslConnectionOpts(),
          metadataMaxAge: 50,
        },
        saslBrokers()
      ),
    })

    await admin.connect()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    admin && (await admin.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('deleteAcls', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the acl filter array is invalid', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: 'this-is-not-an-array' })).rejects.toHaveProperty(
        'message',
        'Invalid ACL Filter array this-is-not-an-array'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the resource name is invalid', async () => {
      const ACLFilter = {
        resourceType: ACL_RESOURCE_TYPES.TOPIC,
        resourceName: 123,
        resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        principal: 'User:foo',
        host: '*',
        operation: ACL_OPERATION_TYPES.ALL,
        permissionType: ACL_PERMISSION_TYPES.DENY,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        'Invalid ACL Filter array, the resourceNames have to be a valid string'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the principal name is invalid', async () => {
      const ACLFilter = {
        resourceType: ACL_RESOURCE_TYPES.TOPIC,
        resourceName: 'foo',
        resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        principal: 123,
        host: '*',
        operation: ACL_OPERATION_TYPES.ALL,
        permissionType: ACL_PERMISSION_TYPES.DENY,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        'Invalid ACL Filter array, the principals have to be a valid string'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if the host name is invalid', async () => {
      const ACLFilter = {
        resourceType: ACL_RESOURCE_TYPES.TOPIC,
        resourceName: 'foo',
        resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        principal: 'User:foo',
        host: 123,
        operation: ACL_OPERATION_TYPES.ALL,
        permissionType: ACL_PERMISSION_TYPES.DENY,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        'Invalid ACL Filter array, the hosts have to be a valid string'
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource types', async () => {
      const ACLFilter = {
        resourceType: 123,
        resourceName: 'foo',
        resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        principal: 'User:foo',
        host: '*',
        operation: ACL_OPERATION_TYPES.ALL,
        permissionType: ACL_PERMISSION_TYPES.DENY,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        `Invalid resource type 123: ${JSON.stringify(ACLFilter)}`
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid resource pattern types', async () => {
      const ACLFilter = {
        resourceType: ACL_RESOURCE_TYPES.TOPIC,
        resourceName: 'foo',
        resourcePatternType: 123,
        principal: 'User:foo',
        host: '*',
        operation: ACL_OPERATION_TYPES.ALL,
        permissionType: ACL_PERMISSION_TYPES.DENY,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        `Invalid resource pattern type 123: ${JSON.stringify(ACLFilter)}`
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid permission types', async () => {
      const ACLFilter = {
        resourceType: ACL_RESOURCE_TYPES.TOPIC,
        resourceName: 'foo',
        resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        principal: 'User:foo',
        host: '*',
        operation: ACL_OPERATION_TYPES.ALL,
        permissionType: 123,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        `Invalid permission type 123: ${JSON.stringify(ACLFilter)}`
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('throws an error if there are invalid operation types', async () => {
      const ACLFilter = {
        resourceType: ACL_RESOURCE_TYPES.TOPIC,
        resourceName: 'foo',
        resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        principal: 'User:foo',
        host: '*',
        operation: 123,
        permissionType: ACL_PERMISSION_TYPES.DENY,
      }

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(admin.deleteAcls({ filters: [ACLFilter] })).rejects.toHaveProperty(
        'message',
        `Invalid operation type 123: ${JSON.stringify(ACLFilter)}`
      )
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('applies and deletes acl', async () => {
      const topicName = `test-topic-${secureRandom()}`

      await admin.createTopics({
        waitForLeaders: true,
        topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 2 }],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.createAcls({
          acl: [
            {
              resourceType: ACL_RESOURCE_TYPES.TOPIC,
              resourceName: topicName,
              resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
              principal: 'User:bob',
              host: '*',
              operation: ACL_OPERATION_TYPES.ALL,
              permissionType: ACL_PERMISSION_TYPES.DENY,
            },
            {
              resourceType: ACL_RESOURCE_TYPES.TOPIC,
              resourceName: topicName,
              resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
              principal: 'User:alice',
              host: '*',
              operation: ACL_OPERATION_TYPES.ALL,
              permissionType: ACL_PERMISSION_TYPES.ALLOW,
            },
          ],
        })
      ).resolves.toEqual(true)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.deleteAcls({
          filters: [
            {
              resourceName: topicName,
              resourceType: ACL_RESOURCE_TYPES.TOPIC,
              host: '*',
              permissionType: ACL_PERMISSION_TYPES.ALLOW,
              operation: ACL_OPERATION_TYPES.ANY,
              resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
            },
          ],
        })
      ).resolves.toMatchObject({
        filterResponses: [
          {
            errorCode: 0,
            errorMessage: null,
            matchingAcls: [
              {
                errorCode: 0,
                errorMessage: null,
                resourceType: ACL_RESOURCE_TYPES.TOPIC,
                resourceName: topicName,
                resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
                principal: 'User:alice',
                host: '*',
                operation: ACL_OPERATION_TYPES.ALL,
                permissionType: ACL_PERMISSION_TYPES.ALLOW,
              },
            ],
          },
        ],
      })

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(
        admin.describeAcls({
          resourceName: topicName,
          resourceType: ACL_RESOURCE_TYPES.TOPIC,
          host: '*',
          permissionType: ACL_PERMISSION_TYPES.ALLOW,
          operation: ACL_OPERATION_TYPES.ANY,
          resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
        })
      ).resolves.toMatchObject({ resources: [] })
    })
  })
})
