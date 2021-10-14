// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MemberMeta... Remove this comment to see the full error message
const { MemberMetadata, MemberAssignment } = require('../assignerProtocol')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createCons... Remove this comment to see the full error message
const createConsumer = require('../index')

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'secureRand... Remove this comment to see the full error message
  secureRandom,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createClus... Remove this comment to see the full error message
  createCluster,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTopi... Remove this comment to see the full error message
  createTopic,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'newLogger'... Remove this comment to see the full error message
  newLogger,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'waitForCon... Remove this comment to see the full error message
  waitForConsumerToJoinGroup,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('testHelpers')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Consumer > assignerProtocol > integration', () => {
  let topicName: any, groupId: any, cluster1: any, cluster2: any, consumer1: any, consumer2: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topicName })

    cluster1 = createCluster()
    cluster2 = createCluster()
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer1 && (await consumer1.disconnect())
    consumer2 && (await consumer2.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('provides member user data', async () => {
    const assignmentMemberUserData = {}
    function createAssigner(id: any) {
      return () => ({
        name: 'TestAssigner',
        version: 1,
        protocol({
          topics
        }: any) {
          // Encode the id as user data
          return {
            name: this.name,
            metadata: MemberMetadata.encode({
              version: this.version,
              topics,
              // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
              userData: Buffer.from(id),
            }),
          }
        },
        async assign({
          members
        }: any) {
          // Dummy assignment: just assign nothing to each member, but keep the
          // user data for each member for checking it later.
          return members.map(({
            memberId,
            memberMetadata
          }: any) => {
            const decodedMetadata = MemberMetadata.decode(memberMetadata)
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            assignmentMemberUserData[memberId] = decodedMetadata.userData.toString('utf8')

            return {
              memberId,
              memberAssignment: MemberAssignment.encode({
                version: this.version,
                assignment: [],
              }),
            }
          });
        },
      });
    }
    // Connect the two consumers to their respective clusters
    consumer1 = createConsumer({
      cluster: cluster1,
      groupId,
      maxWaitTimeInMs: 1,
      logger: newLogger(),
      partitionAssigners: [createAssigner('consumer1')],
    })

    consumer2 = createConsumer({
      cluster: cluster2,
      groupId,
      maxWaitTimeInMs: 1,
      logger: newLogger(),
      partitionAssigners: [createAssigner('consumer2')],
    })

    // Wait until the consumers are connected
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([consumer1.connect(), consumer2.connect()])

    // Subscribe both consumers to the same topic, and start the consumer groups
    consumer1.subscribe({ topic: topicName })
    consumer1.run({ eachMessage: () => {} })
    consumer2.subscribe({ topic: topicName })
    consumer2.run({ eachMessage: () => {} })

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      waitForConsumerToJoinGroup(consumer1),
      waitForConsumerToJoinGroup(consumer2),
    ])

    // Check that we now have seen for each member a matching entry
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.values(assignmentMemberUserData).sort()).toEqual(['consumer1', 'consumer2'])
  })
})
