import requestV0 from '../v0/request.ts'

/**
 * DeleteRecords Request (Version: 1) => [topics] timeout_ms
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset
 *       partition => INT32
 *       offset => INT64
 *   timeout => INT32
 */
export default({
 topics,
 timeout
}: any) =>
  Object.assign(requestV0({ topics, timeout }), { apiVersion: 1 })
