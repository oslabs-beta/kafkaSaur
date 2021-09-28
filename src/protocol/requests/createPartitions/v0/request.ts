// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { CreatePartitions: apiKey } = require('../../apiKeys')

/**
 * CreatePartitions Request (Version: 0) => [topic_partitions] timeout validate_only
 *   topic_partitions => topic new_partitions
 *     topic => STRING
 *     new_partitions => count [assignment]
 *       count => INT32
 *       assignment => ARRAY(INT32)
 *   timeout => INT32
 *   validate_only => BOOLEAN
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  topicPartitions,
  validateOnly = false,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'CreatePartitions',
  encode: async () => {
    return new Encoder()
      .writeArray(topicPartitions.map(encodeTopicPartitions))
      .writeInt32(timeout)
      .writeBoolean(validateOnly)
  },
})

const encodeTopicPartitions = ({
  topic,
  count,
  assignments = []
}: any) => {
  return new Encoder()
    .writeString(topic)
    .writeInt32(count)
    .writeNullableArray(assignments.map(encodeAssignments))
}

const encodeAssignments = (brokerIds: any) => {
  return new Encoder().writeNullableArray(brokerIds)
}
