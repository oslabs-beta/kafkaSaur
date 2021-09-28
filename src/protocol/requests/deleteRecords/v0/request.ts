// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Encoder'.
const Encoder = require('../../../encoder')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKey'.
const { DeleteRecords: apiKey } = require('../../apiKeys')

/**
 * DeleteRecords Request (Version: 0) => [topics] timeout_ms
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset
 *       partition => INT32
 *       offset => INT64
 *   timeout => INT32
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  topics,
  timeout = 5000
}: any) => ({
  apiKey,
  apiVersion: 0,
  apiName: 'DeleteRecords',
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
