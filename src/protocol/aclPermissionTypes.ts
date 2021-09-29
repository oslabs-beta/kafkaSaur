// From:
// https://github.com/apache/kafka/blob/trunk/clients/src/main/java/org/apache/kafka/common/acl/AclPermissionType.java/#L31

/**
 * @typedef {number} ACLPermissionTypes
 *
 * Enum for Permission Types
 * @readonly
 * @enum {ACLPermissionTypes}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export {
  /**
   * Represents any AclPermissionType which this client cannot understand,
   * perhaps because this client is too old.
   */
  UNKNOWN: 0,
  /**
   * In a filter, matches any AclPermissionType.
   */
  ANY: 1,
  /**
   * Disallows access.
   */
  DENY: 2,
  /**
   * Grants access.
   */
  ALLOW: 3,
}
