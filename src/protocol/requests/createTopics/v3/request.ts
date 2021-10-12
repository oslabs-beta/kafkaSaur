
import requestV2 from '../v2/request.ts'

/**
 * CreateTopics Request (Version: 3) => [create_topic_requests] timeout validate_only
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
 *   validate_only => BOOLEAN
 */

export default({
 topics,
 validateOnly,
 timeout
}: any) =>
  Object.assign(requestV2({ topics, validateOnly, timeout }), { apiVersion: 3 })
