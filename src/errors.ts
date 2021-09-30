
import pkgJson from '../package.json';
const { bugs } = pkgJson

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSErr... Remove this comment to see the full error message
class KafkaJSError extends Error {
  helpUrl: any;
  retriable: any;
  constructor(e: any, { retriable = true } = {}) {
    // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
    super(e)
    (Error as any).captureStackTrace(this, this.constructor);
    this.message = e.message || e
    this.name = 'KafkaJSError'
    this.retriable = retriable
    this.helpUrl = e.helpUrl
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNon... Remove this comment to see the full error message
class KafkaJSNonRetriableError extends KafkaJSError {
  constructor(e: any) {
    super(e, { retriable: false })
    this.name = 'KafkaJSNonRetriableError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSPro... Remove this comment to see the full error message
class KafkaJSProtocolError extends KafkaJSError {
  code: any;
  type: any;
  constructor(e: any, { retriable = e.retriable } = {}) {
    super(e, { retriable })
    this.type = e.type
    this.code = e.code
    this.name = 'KafkaJSProtocolError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSOff... Remove this comment to see the full error message
class KafkaJSOffsetOutOfRange extends KafkaJSProtocolError {
  partition: any;
  topic: any;
  constructor(e: any, {
    topic,
    partition
  }: any) {
    super(e)
    this.topic = topic
    this.partition = partition
    this.name = 'KafkaJSOffsetOutOfRange'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSMem... Remove this comment to see the full error message
class KafkaJSMemberIdRequired extends KafkaJSProtocolError {
  memberId: any;
  constructor(e: any, {
    memberId
  }: any) {
    super(e)
    this.memberId = memberId
    this.name = 'KafkaJSMemberIdRequired'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNum... Remove this comment to see the full error message
class KafkaJSNumberOfRetriesExceeded extends KafkaJSNonRetriableError {
  originalError: any;
  retryCount: any;
  retryTime: any;
  constructor(e: any, {
    retryCount,
    retryTime
  }: any) {
    super(e)
    this.stack = `${this.name}\n  Caused by: ${e.stack}`
    this.originalError = e
    this.retryCount = retryCount
    this.retryTime = retryTime
    this.name = 'KafkaJSNumberOfRetriesExceeded'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSCon... Remove this comment to see the full error message
class KafkaJSConnectionError extends KafkaJSError {
  broker: any;
  code: any;
  constructor(e: any, {
    broker,
    code
  }: any = {}) {
    super(e)
    this.broker = broker
    this.code = code
    this.name = 'KafkaJSConnectionError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSCon... Remove this comment to see the full error message
class KafkaJSConnectionClosedError extends KafkaJSConnectionError {
  host: any;
  port: any;
  constructor(e: any, {
    host,
    port
  }: any = {}) {
    super(e, { broker: `${host}:${port}` })
    this.host = host
    this.port = port
    this.name = 'KafkaJSConnectionClosedError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSReq... Remove this comment to see the full error message
class KafkaJSRequestTimeoutError extends KafkaJSError {
  broker: any;
  correlationId: any;
  createdAt: any;
  pendingDuration: any;
  sentAt: any;
  constructor(e: any, {
    broker,
    correlationId,
    createdAt,
    sentAt,
    pendingDuration
  }: any = {}) {
    super(e)
    this.broker = broker
    this.correlationId = correlationId
    this.createdAt = createdAt
    this.sentAt = sentAt
    this.pendingDuration = pendingDuration
    this.name = 'KafkaJSRequestTimeoutError'
  }
}

class KafkaJSMetadataNotLoaded extends KafkaJSError {
  constructor(p1?: any) {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1-2 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSMetadataNotLoaded'
  }
}
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSTop... Remove this comment to see the full error message
class KafkaJSTopicMetadataNotLoaded extends KafkaJSMetadataNotLoaded {
  topic: any;
  constructor(e: any, {
    topic
  }: any = {}) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    super(e)
    this.topic = topic
    this.name = 'KafkaJSTopicMetadataNotLoaded'
  }
}
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSta... Remove this comment to see the full error message
class KafkaJSStaleTopicMetadataAssignment extends KafkaJSError {
  topic: any;
  unknownPartitions: any;
  constructor(e: any, {
    topic,
    unknownPartitions
  }: any = {}) {
    super(e)
    this.topic = topic
    this.unknownPartitions = unknownPartitions
    this.name = 'KafkaJSStaleTopicMetadataAssignment'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSDel... Remove this comment to see the full error message
class KafkaJSDeleteGroupsError extends KafkaJSError {
  groups: any;
  constructor(e: any, groups = []) {
    super(e)
    this.groups = groups
    this.name = 'KafkaJSDeleteGroupsError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSer... Remove this comment to see the full error message
class KafkaJSServerDoesNotSupportApiKey extends KafkaJSNonRetriableError {
  apiKey: any;
  apiName: any;
  constructor(e: any, {
    apiKey,
    apiName
  }: any = {}) {
    super(e)
    this.apiKey = apiKey
    this.apiName = apiName
    this.name = 'KafkaJSServerDoesNotSupportApiKey'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSBro... Remove this comment to see the full error message
class KafkaJSBrokerNotFound extends KafkaJSError {
  constructor(p1?: any) {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1-2 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSBrokerNotFound'
  }
}

class KafkaJSPartialMessageError extends KafkaJSNonRetriableError {
  constructor(p1?: any) {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSPartialMessageError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSAS... Remove this comment to see the full error message
class KafkaJSSASLAuthenticationError extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSSASLAuthenticationError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSGro... Remove this comment to see the full error message
class KafkaJSGroupCoordinatorNotFound extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSGroupCoordinatorNotFound'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSNot... Remove this comment to see the full error message
class KafkaJSNotImplemented extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSNotImplemented'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSTim... Remove this comment to see the full error message
class KafkaJSTimeout extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSTimeout'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSLoc... Remove this comment to see the full error message
class KafkaJSLockTimeout extends KafkaJSTimeout {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 0 arguments, but got 1 or more.
    super(...arguments)
    this.name = 'KafkaJSLockTimeout'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSUns... Remove this comment to see the full error message
class KafkaJSUnsupportedMagicByteInMessageSet extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSUnsupportedMagicByteInMessageSet'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSDel... Remove this comment to see the full error message
class KafkaJSDeleteTopicRecordsError extends KafkaJSError {
  partitions: any;
  constructor({
    partitions
  }: any) {
    /*
     * This error is retriable if all the errors were retriable
     */
    const retriable = partitions
      .filter(({
      error
    }: any) => error != null)
      .every(({
      error
    }: any) => error.retriable === true)

    super('Error while deleting records', { retriable })
    this.name = 'KafkaJSDeleteTopicRecordsError'
    this.partitions = partitions
  }
}

const issueUrl = bugs ? bugs.url : null

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSInv... Remove this comment to see the full error message
class KafkaJSInvariantViolation extends KafkaJSNonRetriableError {
  helpUrl: any;
  constructor(e: any) {
    const message = e.message || e
    super(`Invariant violated: ${message}. This is likely a bug and should be reported.`)
    this.name = 'KafkaJSInvariantViolation'

    if (issueUrl !== null) {
      const issueTitle = encodeURIComponent(`Invariant violation: ${message}`)
      this.helpUrl = `${issueUrl}/new?assignees=&labels=bug&template=bug_report.md&title=${issueTitle}`
    }
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSInv... Remove this comment to see the full error message
class KafkaJSInvalidVarIntError extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSNonRetriableError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSInv... Remove this comment to see the full error message
class KafkaJSInvalidLongError extends KafkaJSNonRetriableError {
  constructor() {
    // @ts-expect-error ts-migrate(2556) FIXME: Expected 1 arguments, but got 0 or more.
    super(...arguments)
    this.name = 'KafkaJSNonRetriableError'
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSCre... Remove this comment to see the full error message
class KafkaJSCreateTopicError extends KafkaJSProtocolError {
  topic: any;
  constructor(e: any, topicName: any) {
    super(e)
    this.topic = topicName
    this.name = 'KafkaJSCreateTopicError'
  }
}
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSAgg... Remove this comment to see the full error message
class KafkaJSAggregateError extends Error {
  errors: any;
  constructor(message: any, errors: any) {
    super(message)
    this.errors = errors
    this.name = 'KafkaJSAggregateError'
  }
}


export {
  KafkaJSError,
  KafkaJSNonRetriableError,
  KafkaJSPartialMessageError,
  KafkaJSBrokerNotFound,
  KafkaJSProtocolError,
  KafkaJSConnectionError,
  KafkaJSConnectionClosedError,
  KafkaJSRequestTimeoutError,
  KafkaJSSASLAuthenticationError,
  KafkaJSNumberOfRetriesExceeded,
  KafkaJSOffsetOutOfRange,
  KafkaJSMemberIdRequired,
  KafkaJSGroupCoordinatorNotFound,
  KafkaJSNotImplemented,
  KafkaJSMetadataNotLoaded,
  KafkaJSTopicMetadataNotLoaded,
  KafkaJSStaleTopicMetadataAssignment,
  KafkaJSDeleteGroupsError,
  KafkaJSTimeout,
  KafkaJSLockTimeout,
  KafkaJSServerDoesNotSupportApiKey,
  KafkaJSUnsupportedMagicByteInMessageSet,
  KafkaJSDeleteTopicRecordsError,
  KafkaJSInvariantViolation,
  KafkaJSInvalidVarIntError,
  KafkaJSInvalidLongError,
  KafkaJSCreateTopicError,
  KafkaJSAggregateError,
}
