import {Decoder} from '../../../decoder.ts';
import response from '../v0/response.ts'

const parseV0 = response.parse
/**
 * Starting in version 1, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * DeleteTopics Response (Version: 1) => throttle_time_ms [topic_error_codes]
 *   throttle_time_ms => INT32
 *   topic_error_codes => topic error_code
 *     topic => STRING
 *     error_code => INT16
 */

const topicNameComparator = (a: any, b: any) => a.topic.localeCompare(b.topic)

const topicErrors = (decoder: any) => ({
  topic: decoder.readString(),
  errorCode: decoder.readInt16()
})

const decode = async (rawData: any) => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()

  return {
    throttleTime: 0,
    clientSideThrottleTime: throttleTime,
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  }
}

export default {
  decode,
  parse: parseV0,
}
