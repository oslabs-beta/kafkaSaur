// From: https://kafka.apache.org/protocol.html#The_Messages_FindCoordinator

/**
 * @typedef {number} CoordinatorType
 *
 * Enum for the types of coordinator to find.
 * @enum {CoordinatorType}
 */
export default{
  GROUP: 0,
  TRANSACTION: 1,
}
