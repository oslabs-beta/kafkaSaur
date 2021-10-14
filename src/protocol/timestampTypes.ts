/**
 * Enum for timestamp types
 *
 * @format
 * @readonly
 * @enum {TimestampType}
 */

export default {
  // Timestamp type is unknown
  NO_TIMESTAMP: -1,

  // Timestamp relates to message creation time as set by a Kafka client
  CREATE_TIME: 0,

  // Timestamp relates to the time a message was appended to a Kafka log
  LOG_APPEND_TIME: 1,
};
