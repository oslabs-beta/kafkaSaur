// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
const flatten = require('../utils/flatten')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ({
  topics
}: any) => {
  const partitions = topics.map(({
    topicName,
    partitions
  }: any) =>
    partitions.map((partition: any) => ({
      topicName,
      ...partition
    }))
  )

  return flatten(partitions)
}
