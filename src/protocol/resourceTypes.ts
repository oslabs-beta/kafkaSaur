// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ACLResourceTypes = require('./aclResourceTypes')

/**
 * @deprecated
 * @see https://github.com/tulios/kafkajs/issues/649
 *
 * Use ConfigResourceTypes or AclResourceTypes instead.
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ACLResourceTypes
