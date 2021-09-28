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
describe('Consumer', () => {
  let topic: any, groupId: any, consumer1: any, consumer2: any

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topic = `test-topic-${secureRandom()}`
    groupId = `consumer-group-id-${secureRandom()}`

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    await createTopic({ topic: topic, partitions: 1 })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    consumer1 && (await consumer1.disconnect())
    consumer2 && (await consumer2.disconnect())
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('can join the group without receiving any assignment', async () => {
    // Assigns all topic-partitions to the first member.
    const UnbalancedAssigner = ({
      cluster
    }: any) => ({
      name: 'UnbalancedAssigner',
      version: 1,
      async assign({
        members,
        topics,
        userData
      }: any) {
        const sortedMembers = members.map(({
          memberId
        }: any) => memberId).sort()
        const firstMember = sortedMembers[0]
        const assignment = {
          [firstMember]: {},
        }

        topics.forEach((topic: any) => {
          const partitionMetadata = cluster.findTopicPartitionMetadata(topic)
          const partitions = partitionMetadata.map((m: any) => m.partitionId)
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          assignment[firstMember][topic] = partitions
        })

        return Object.keys(assignment).map(memberId => ({
          memberId,
          memberAssignment: MemberAssignment.encode({
            version: this.version,
            // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            assignment: assignment[memberId],
            userData,
          }),
        }))
      },
      protocol({
        topics,
        userData
      }: any) {
        return {
          name: this.name,
          metadata: MemberMetadata.encode({
            version: this.version,
            topics,
            userData,
          }),
        }
      },
    })

    consumer1 = createConsumer({
      cluster: createCluster(),
      groupId,
      maxWaitTimeInMs: 1,
      logger: newLogger(),
      partitionAssigners: [UnbalancedAssigner],
    })

    consumer2 = createConsumer({
      cluster: createCluster(),
      groupId,
      maxWaitTimeInMs: 1,
      logger: newLogger(),
      partitionAssigners: [UnbalancedAssigner],
    })

    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([consumer1.connect(), consumer2.connect()])

    consumer1.subscribe({ topic })
    consumer2.subscribe({ topic })

    consumer1.run({ eachMessage: () => {} })
    consumer2.run({ eachMessage: () => {} })

    // Ensure that both consumers manage to join
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    await Promise.all([
      waitForConsumerToJoinGroup(consumer1),
      waitForConsumerToJoinGroup(consumer2),
    ])
  })
})
