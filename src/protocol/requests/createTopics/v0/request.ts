// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { CreateTopics: apiKey } = require('../../apiKeys')

/**
 * CreateTopics Request (Version: 0) => [create_topic_requests] timeout
 *   create_topic_requests => topic num_partitions replication_factor [replica_assignment] [config_entries]
 *     topic => STRING
 *     num_partitions => INT32
 *     replication_factor => INT16
 *     replica_assignment => partition [replicas]
 *       partition => INT32
 *       replicas => INT32
 *     config_entries => config_name config_value
 *       config_name => STRING
 *       config_value => NULLABLE_STRING
 *   timeout => INT32
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  topics,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'CreateTopics',
  encode: async () => {
    return new Encoder().writeArray(topics.map(encodeTopics)).writeInt32(timeout)
  },
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeTopi... Remove this comment to see the full error message
const encodeTopics = ({
  topic,
  numPartitions = 1,
  replicationFactor = 1,
  replicaAssignment = [],
  configEntries = []
}: any) => {
  return new Encoder()
    .writeString(topic)
    .writeInt32(numPartitions)
    .writeInt16(replicationFactor)
    .writeArray(replicaAssignment.map(encodeReplicaAssignment))
    .writeArray(configEntries.map(encodeConfigEntries))
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeRepl... Remove this comment to see the full error message
const encodeReplicaAssignment = ({
  partition,
  replicas
}: any) => {
  return new Encoder().writeInt32(partition).writeArray(replicas)
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeConf... Remove this comment to see the full error message
const encodeConfigEntries = ({
  name,
  value
}: any) => {
  return new Encoder().writeString(name).writeString(value)
}
