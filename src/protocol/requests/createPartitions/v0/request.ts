

import {Encoder} from '../../../encoder.ts' 
import apiKeys from '../../apiKeys.ts'

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
const apiKey = apiKeys.CreatePartitions
export default({
  topicPartitions,
  validateOnly = false,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'CreatePartitions',
  //deno-lint-ignore require-await
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
    .writeNullableArray(assignments.map(encodeAssignments) )
}

const encodeAssignments = (brokerIds: any) => {
  return new Encoder().writeNullableArray(brokerIds)
}
