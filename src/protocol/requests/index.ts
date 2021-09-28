// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'apiKeys'.
const apiKeys = require('./apiKeys')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KafkaJSSer... Remove this comment to see the full error message
const { KafkaJSServerDoesNotSupportApiKey, KafkaJSNotImplemented } = require('../../errors')

/**
 * @typedef {(options?: Object) => { request: any, response: any, logResponseErrors?: boolean }} Request
 */

/**
 * @typedef {Object} RequestDefinitions
 * @property {string[]} versions
 * @property {({ version: number }) => Request} protocol
 */

/**
 * @typedef {(apiKey: number, definitions: RequestDefinitions) => Request} Lookup
 */

/** @type {RequestDefinitions} */
const noImplementedRequestDefinitions = {
  versions: [],
  protocol: () => {
    throw new KafkaJSNotImplemented()
  },
}

/**
 * @type {{[apiName: string]: RequestDefinitions}}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requests'.
const requests = {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  Produce: require('./produce'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  Fetch: require('./fetch'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  ListOffsets: require('./listOffsets'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  Metadata: require('./metadata'),
  LeaderAndIsr: noImplementedRequestDefinitions,
  StopReplica: noImplementedRequestDefinitions,
  UpdateMetadata: noImplementedRequestDefinitions,
  ControlledShutdown: noImplementedRequestDefinitions,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  OffsetCommit: require('./offsetCommit'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  OffsetFetch: require('./offsetFetch'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  GroupCoordinator: require('./findCoordinator'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  JoinGroup: require('./joinGroup'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  Heartbeat: require('./heartbeat'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  LeaveGroup: require('./leaveGroup'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  SyncGroup: require('./syncGroup'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DescribeGroups: require('./describeGroups'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  ListGroups: require('./listGroups'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  SaslHandshake: require('./saslHandshake'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  ApiVersions: require('./apiVersions'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  CreateTopics: require('./createTopics'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DeleteTopics: require('./deleteTopics'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DeleteRecords: require('./deleteRecords'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  InitProducerId: require('./initProducerId'),
  OffsetForLeaderEpoch: noImplementedRequestDefinitions,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  AddPartitionsToTxn: require('./addPartitionsToTxn'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  AddOffsetsToTxn: require('./addOffsetsToTxn'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  EndTxn: require('./endTxn'),
  WriteTxnMarkers: noImplementedRequestDefinitions,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  TxnOffsetCommit: require('./txnOffsetCommit'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DescribeAcls: require('./describeAcls'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  CreateAcls: require('./createAcls'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DeleteAcls: require('./deleteAcls'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DescribeConfigs: require('./describeConfigs'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  AlterConfigs: require('./alterConfigs'),
  AlterReplicaLogDirs: noImplementedRequestDefinitions,
  DescribeLogDirs: noImplementedRequestDefinitions,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  SaslAuthenticate: require('./saslAuthenticate'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  CreatePartitions: require('./createPartitions'),
  CreateDelegationToken: noImplementedRequestDefinitions,
  RenewDelegationToken: noImplementedRequestDefinitions,
  ExpireDelegationToken: noImplementedRequestDefinitions,
  DescribeDelegationToken: noImplementedRequestDefinitions,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  DeleteGroups: require('./deleteGroups'),
}

const names = Object.keys(apiKeys)
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'keys'.
const keys = Object.values(apiKeys)
const findApiName = (apiKey: any) => names[(keys as any).indexOf(apiKey)];

/**
 * @param {import("../../../types").ApiVersions} versions
 * @returns {Lookup}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookup'.
const lookup = (versions: any) => (apiKey: any, definition: any) => {
  const version = versions[apiKey]
  const availableVersions = definition.versions.map(Number)
  // @ts-expect-error ts-migrate(7041) FIXME: The containing arrow function captures the global ... Remove this comment to see the full error message
  const bestImplementedVersion = Math.max.apply(this, availableVersions)

  if (!version || version.maxVersion == null) {
    throw new KafkaJSServerDoesNotSupportApiKey(
      `The Kafka server does not support the requested API version`,
      { apiKey, apiName: findApiName(apiKey) }
    )
  }

  const bestSupportedVersion = Math.min(bestImplementedVersion, version.maxVersion)
  return definition.protocol({ version: bestSupportedVersion })
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  requests,
  lookup,
}
