// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Decoder'.
const Decoder = require('../../../decoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseV1'.
const { parse: parseV1 } = require('../v1/response')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeMess... Remove this comment to see the full error message
const decodeMessages = require('../v4/decodeMessages')

/**
 * Fetch Response (Version: 11) => throttle_time_ms error_code session_id [responses]
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   session_id => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition_header record_set
 *       partition_header => partition error_code high_watermark last_stable_offset log_start_offset [aborted_transactions]
 *         partition => INT32
 *         error_code => INT16
 *         high_watermark => INT64
 *         last_stable_offset => INT64
 *         log_start_offset => INT64
 *         aborted_transactions => producer_id first_offset
 *           producer_id => INT64
 *           first_offset => INT64
 *         preferred_read_replica => INT32
 *       record_set => RECORDS
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeAbor... Remove this comment to see the full error message
const decodeAbortedTransactions = (decoder: any) => ({
  producerId: decoder.readInt64().toString(),
  firstOffset: decoder.readInt64().toString()
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodePart... Remove this comment to see the full error message
const decodePartition = async (decoder: any) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  highWatermark: decoder.readInt64().toString(),
  lastStableOffset: decoder.readInt64().toString(),
  lastStartOffset: decoder.readInt64().toString(),
  abortedTransactions: decoder.readArray(decodeAbortedTransactions),
  preferredReadReplica: decoder.readInt32(),
  messages: await decodeMessages(decoder)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decodeResp... Remove this comment to see the full error message
const decodeResponse = async (decoder: any) => ({
  topicName: decoder.readString(),
  partitions: await decoder.readArrayAsync(decodePartition)
})

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const clientSideThrottleTime = decoder.readInt32()
  const errorCode = decoder.readInt16()
  const sessionId = decoder.readInt32()
  const responses = await decoder.readArrayAsync(decodeResponse)

  // Report a `throttleTime` of 0: The broker will not have throttled
  // this request, but if the `clientSideThrottleTime` is >0 then it
  // expects us to do that -- and it will ignore requests.
  return {
    throttleTime: 0,
    clientSideThrottleTime,
    errorCode,
    sessionId,
    responses,
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  decode,
  parse: parseV1,
}