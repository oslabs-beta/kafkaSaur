// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export () => ({
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  KAFKAJS_DEBUG_PROTOCOL_BUFFERS: process.env.KAFKAJS_DEBUG_PROTOCOL_BUFFERS,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS: process.env.KAFKAJS_DEBUG_EXTENDED_PROTOCOL_BUFFERS,
})
