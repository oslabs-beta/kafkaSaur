//deno-lint-ignore-file no-explicit-any no-unused-vars
/** @format */

class KafkaJSError extends Error {
  [key: string]: any
  constructor(e: any, { retriable = true } = {}) {
    super(e)
    Error.captureStackTrace(this, this.constructor)
    this.message = e.message || e
    this.name = 'KafkaJSError'
    this.retriable = retriable
    this.helpUrl = e.helpUrl
  }
}

class KafkaJSNonRetriableError extends KafkaJSError {
  constructor(e: any) {
    super(e, { retriable: false });
    this.name = 'KafkaJSNonRetriableError';
  }
}

class KafkaJSProtocolError extends KafkaJSError {
  code: any;
  type: any;
  constructor(e: any, { retriable = e.retriable } = {}) {
    super(e, { retriable });
    this.type = e.type;
    this.code = e.code;
    this.name = 'KafkaJSProtocolError';
  }
}

class KafkaJSOffsetOutOfRange extends KafkaJSProtocolError {
  partition: any;
  topic: any;
  constructor(e: any, { topic, partition }: any) {
    super(e);
    this.topic = topic;
    this.partition = partition;
    this.name = 'KafkaJSOffsetOutOfRange';
  }
}

class KafkaJSMemberIdRequired extends KafkaJSProtocolError {
  memberId: any;
  constructor(e: any, { memberId }: any) {
    super(e);
    this.memberId = memberId;
    this.name = 'KafkaJSMemberIdRequired';
  }
}

class KafkaJSNumberOfRetriesExceeded extends KafkaJSNonRetriableError {
  originalError: any;
  retryCount: any;
  retryTime: any;
  constructor(e: any, { retryCount, retryTime }: any) {
    super(e);
    this.stack = `${this.name}\n  Caused by: ${e.stack}`;
    this.originalError = e;
    this.retryCount = retryCount;
    this.retryTime = retryTime;
    this.name = 'KafkaJSNumberOfRetriesExceeded';
  }
}

class KafkaJSConnectionError extends KafkaJSError {
  broker: any;
  code: any;
  constructor(e: any, { broker, code }: any = {}) {
    super(e);
    this.broker = broker;
    this.code = code;
    this.name = 'KafkaJSConnectionError';
  }
}

class KafkaJSConnectionClosedError extends KafkaJSConnectionError {
  host: any;
  port: any;
  constructor(e: any, { host, port }: any = {}) {
    super(e, { broker: `${host}:${port}` });
    this.host = host;
    this.port = port;
    this.name = 'KafkaJSConnectionClosedError';
  }
}

class KafkaJSRequestTimeoutError extends KafkaJSError {
  broker: any;
  correlationId: any;
  createdAt: any;
  pendingDuration: any;
  sentAt: any;
  constructor(
    e: any,
    { broker, correlationId, createdAt, sentAt, pendingDuration }: any = {}
  ) {
    super(e);
    this.broker = broker;
    this.correlationId = correlationId;
    this.createdAt = createdAt;
    this.sentAt = sentAt;
    this.pendingDuration = pendingDuration;
    this.name = 'KafkaJSRequestTimeoutError';
  }
}

class KafkaJSMetadataNotLoaded extends KafkaJSError {
  constructor(p1?: any, p2?: any, p3?: any) {
    super(p1, p2,);
    this.name = 'KafkaJSMetadataNotLoaded';
  }
}
class KafkaJSTopicMetadataNotLoaded extends KafkaJSMetadataNotLoaded {
  topic: any;
  constructor(e: any, { topic }: any = {}) {
    super(e);
    this.topic = topic;
    this.name = 'KafkaJSTopicMetadataNotLoaded';
  }
}
class KafkaJSStaleTopicMetadataAssignment extends KafkaJSError {
  topic: any;
  unknownPartitions: any;
  constructor(e: any, { topic, unknownPartitions }: any = {}) {
    super(e);
    this.topic = topic;
    this.unknownPartitions = unknownPartitions;
    this.name = 'KafkaJSStaleTopicMetadataAssignment';
  }
}

class KafkaJSDeleteGroupsError extends KafkaJSError {
  groups: any;
  constructor(e: any, groups = []) {
    super(e);
    this.groups = groups;
    this.name = 'KafkaJSDeleteGroupsError';
  }
}

class KafkaJSServerDoesNotSupportApiKey extends KafkaJSNonRetriableError {
  apiKey: any;
  apiName: any;
  constructor(e: any, { apiKey, apiName }: any = {}) {
    super(e);
    this.apiKey = apiKey;
    this.apiName = apiName;
    this.name = 'KafkaJSServerDoesNotSupportApiKey';
  }
}

class KafkaJSBrokerNotFound extends KafkaJSError {
  constructor(p1?: any, p2?: any, p3?: any) {
    // constructor ()  {

    super(p1, p2,);
    this.name = 'KafkaJSBrokerNotFound';
  }
}

class KafkaJSPartialMessageError extends KafkaJSNonRetriableError {
  constructor(p1?: any, p2?: any, p3?: any) {
    super(p1);
    this.name = 'KafkaJSPartialMessageError';
  }
}

class KafkaJSSASLAuthenticationError extends KafkaJSNonRetriableError {
  constructor(p1?: any, p2?: any, p3?: any) {
    super(p1);
    this.name = 'KafkaJSSASLAuthenticationError';
  }
}

class KafkaJSGroupCoordinatorNotFound extends KafkaJSNonRetriableError {
  constructor(p1?: any) {
    super(p1);
    this.name = 'KafkaJSGroupCoordinatorNotFound';
  }
}

class KafkaJSNotImplemented extends KafkaJSNonRetriableError {
  constructor(p1?: any) {
    super(p1);
    this.name = 'KafkaJSNotImplemented';
  }
}

class KafkaJSTimeout extends KafkaJSNonRetriableError {
  constructor(p1?: any, p2?: any) {
    super(p1);
    this.name = 'KafkaJSTimeout';
  }
}

class KafkaJSLockTimeout extends KafkaJSTimeout {
  constructor(p1?: any, p2?: any, p3?: any) {
    super(p1, p2);
    this.name = 'KafkaJSLockTimeout';
  }
}

class KafkaJSUnsupportedMagicByteInMessageSet extends KafkaJSNonRetriableError {
  constructor(p1: any, p2: any, p3: any) {
    super(p1);
    this.name = 'KafkaJSUnsupportedMagicByteInMessageSet';
  }
}

class KafkaJSDeleteTopicRecordsError extends KafkaJSError {
  partitions: any;
  constructor({ partitions }: any) {
    /*
     * This error is retriable if all the errors were retriable
     */
    const retriable = partitions
      .filter(({ error }: any) => error != null)
      .every(({ error }: any) => error.retriable === true);

    super('Error while deleting records', { retriable });
    this.name = 'KafkaJSDeleteTopicRecordsError';
    this.partitions = partitions;
  }
}

// const issueUrl = bugs ? bugs.url : null;
const issueUrl= 'google.com';

class KafkaJSInvariantViolation extends KafkaJSNonRetriableError {
  constructor(e: any) {
    const message = e.message || e;
    super(
      `Invariant violated: ${message}. This is likely a bug and should be reported.`
    );
    this.name = 'KafkaJSInvariantViolation';

    if (issueUrl !== null) {
      const issueTitle = encodeURIComponent(`Invariant violation: ${message}`);
      this.helpUrl = `${issueUrl}/new?assignees=&labels=bug&template=bug_report.md&title=${issueTitle}`;
    }
  }
}

class KafkaJSInvalidVarIntError extends KafkaJSNonRetriableError {
  constructor(p1?: any) {
    super(p1);
    this.name = 'KafkaJSNonRetriableError';
  }
}

class KafkaJSInvalidLongError extends KafkaJSNonRetriableError {
  constructor(p1?: any) {
    super(p1);
    this.name = 'KafkaJSNonRetriableError';
  }
}

class KafkaJSCreateTopicError extends KafkaJSProtocolError {
  topic: any;
  constructor(e: any, topicName: any) {
    super(e);
    this.topic = topicName;
    this.name = 'KafkaJSCreateTopicError';
  }
}
class KafkaJSAggregateError extends Error {
  errors: any;
  constructor(message: any, errors: any) {
    super(message);
    this.errors = errors;
    this.name = 'KafkaJSAggregateError';
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
};
