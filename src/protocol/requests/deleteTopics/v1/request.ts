
import requestV0 from '../v0/request.ts'
/**
 * DeleteTopics Request (Version: 1) => [topics] timeout
 *   topics => STRING
 *   timeout => INT32
 */

export default ({
 topics,
 timeout
}: any) =>
  Object.assign(requestV0({ topics, timeout }), { apiVersion: 1 })
