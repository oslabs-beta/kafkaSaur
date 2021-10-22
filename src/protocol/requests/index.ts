/** @format */

import apiKeys from './apiKeys.ts';

import Produce from './produce/index.ts';
import Fetch from './fetch/index.ts';
import Findcoordinator from './findCoordinator/index.ts';
import ListOffsets from './listOffsets/index.ts';
import Metadata from './metadata/index.ts';
import OffsetCommit from './offsetCommit/index.ts';
import OffsetFetch from './offsetFetch/index.ts';
import JoinGroup from './joinGroup/index.ts';
import Heartbeat from './heartbeat/index.ts';
import LeaveGroup from './LeaveGroup/index.ts';
import SyncGroup from './syncGroup/index.ts';
import DescribeGroups from './listGroups/index.ts';
import ListGroups from './listGroups/index.ts';
import SaslHandshake from './saslHandshake/index.ts';
import ApiVersions from './apiVersions/index.ts';
import CreateTopics from './createTopics/index.ts';
import DeleteTopics from './deleteTopics/index.ts';
import DeleteRecords from './deleteRecords/index.ts';
import InitProducerId from './initProducerId/index.ts';
import AddPartitionsToTxn from './addPartitionsToTxn/index.ts';
import AddOffsetsToTxn from './addOffsetsToTxn/index.ts';
import EndTxn from './endTxn/index.ts';
import TxnOffsetCommit from './txnOffsetCommit/index.ts';
import DescribeAcls from './describeAcls/index.ts';
import CreateAcls from './createAcls/index.ts';
import DeleteAcls from './deleteAcls/index.ts';
import DescribeConfigs from './describeConfigs/index.ts';
import AlterConfigs from './alterConfigs/index.ts';
import SaslAuthenticate from './saslAuthenticate/index.ts';
import CreatePartitions from './createPartitions/index.ts';
import DeleteGroups from './deleteGroups/index.ts';

import {
  KafkaJSServerDoesNotSupportApiKey,
  KafkaJSNotImplemented,
} from '../../errors.ts';

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
    throw new KafkaJSNotImplemented();
  },
};

/**
 * @type {{[apiName: string]: RequestDefinitions}}
 */
const requests = {
  Produce: Produce,
  Fetch: Fetch,
  ListOffsets: ListOffsets,
  // Findcoordinator: Findcoordinator,
  Metadata: Metadata,
  LeaderAndIsr: noImplementedRequestDefinitions,
  StopReplica: noImplementedRequestDefinitions,
  UpdateMetadata: noImplementedRequestDefinitions,
  ControlledShutdown: noImplementedRequestDefinitions,
  OffsetCommit: OffsetCommit,
  OffsetFetch: OffsetFetch,
  GroupCoordinator: Findcoordinator,
  JoinGroup: JoinGroup,
  Heartbeat: Heartbeat,
  LeaveGroup: LeaveGroup,
  SyncGroup: SyncGroup,
  DescribeGroups: DescribeGroups,
  ListGroups: ListGroups,
  SaslHandshake: SaslHandshake,
  ApiVersions: ApiVersions,
  CreateTopics: CreateTopics,
  DeleteTopics: DeleteTopics,
  DeleteRecords: DeleteRecords,
  InitProducerId: InitProducerId,
  OffsetForLeaderEpoch: noImplementedRequestDefinitions,
  AddPartitionsToTxn: AddPartitionsToTxn,
  AddOffsetsToTxn: AddOffsetsToTxn,
  EndTxn: EndTxn,
  WriteTxnMarkers: noImplementedRequestDefinitions,
  TxnOffsetCommit: TxnOffsetCommit,
  DescribeAcls: DescribeAcls,
  CreateAcls: CreateAcls,
  DeleteAcls: DeleteAcls,
  DescribeConfigs: DescribeConfigs,
  AlterConfigs: AlterConfigs,
  AlterReplicaLogDirs: noImplementedRequestDefinitions,
  DescribeLogDirs: noImplementedRequestDefinitions,
  SaslAuthenticate: SaslAuthenticate,
  CreatePartitions: CreatePartitions,

  CreateDelegationToken: noImplementedRequestDefinitions,
  RenewDelegationToken: noImplementedRequestDefinitions,
  ExpireDelegationToken: noImplementedRequestDefinitions,
  DescribeDelegationToken: noImplementedRequestDefinitions,
  DeleteGroups: DeleteGroups,
};

const names = Object.keys(apiKeys);
const keys = Object.values(apiKeys);
const findApiName = (apiKey: any) => names[(keys as any).indexOf(apiKey)];

/**
 * @param {import("../../../types").ApiVersions} versions
 * @returns {Lookup}
 */
const lookup = (versions: any) => (apiKey: any, definition: any) => {
  const version = versions[apiKey];
  const availableVersions = definition.versions.map(Number);
  const bestImplementedVersion = Math.max.apply(this, availableVersions);

  if (!version || version.maxVersion == null) {
    throw new KafkaJSServerDoesNotSupportApiKey(
      `The Kafka server does not support the requested API version`,
      { apiKey, apiName: findApiName(apiKey) }
    );
  }

  const bestSupportedVersion = Math.min(
    bestImplementedVersion,
    version.maxVersion
  );
  return definition.protocol({ version: bestSupportedVersion });
};

export { requests, lookup };
