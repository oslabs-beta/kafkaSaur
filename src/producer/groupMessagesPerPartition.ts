// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export ({
  topic,
  partitionMetadata,
  messages,
  partitioner
}: any) => {
  if (partitionMetadata.length === 0) {
    return {}
  }

  return messages.reduce((result: any, message: any) => {
    const partition = partitioner({ topic, partitionMetadata, message })
    const current = result[partition] || []
    // @ts-expect-error ts-migrate(2550) FIXME: Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
    return Object.assign(result, { [partition]: [...current, message] })
  }, {});
}
