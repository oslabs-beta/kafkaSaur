/**
 * Enum for timestamp types
 * @readonly
 * @enum {TimestampType}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // Timestamp type is unknown
  NO_TIMESTAMP: -1,

  // Timestamp relates to message creation time as set by a Kafka client
  CREATE_TIME: 0,

  // Timestamp relates to the time a message was appended to a Kafka log
  LOG_APPEND_TIME: 1,
}
