import {Encoder} from '../../../encoder.ts'
import  apiKeys from '../../apiKeys.ts'

const apiKey = apiKeys.DeleteRecords
/**
 * DeleteRecords Request (Version: 0) => [topics] timeout_ms
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset
 *       partition => INT32
 *       offset => INT64
 *   timeout => INT32
 */
export default({
  topics,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteRecords',
  //deno-lint-ignore require-await
  encode: async () => {
    return new Encoder()
      .writeArray(
        topics.map(({
          topic,
          partitions
        }: any) => {
          return new Encoder().writeString(topic).writeArray(
            partitions.map(({
              partition,
              offset
            }: any) => {
              return new Encoder().writeInt32(partition).writeInt64(offset)
            })
          );
        })
      )
      .writeInt32(timeout);
  },
})
