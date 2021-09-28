// From: https://kafka.apache.org/protocol.html#The_Messages_FindCoordinator

/**
 * @typedef {number} CoordinatorType
 *
 * Enum for the types of coordinator to find.
 * @enum {CoordinatorType}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  GROUP: 0,
  TRANSACTION: 1,
}
