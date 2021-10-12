/** @format */

import Kafka from './src/index.ts';
import { roundRobin } from './src/consumer/assigners/index.ts';
import * as AssignerProtocol from './src/consumer/assignerProtocol.ts';
import Partitioners from './src/producer/partitioners/index.ts';
import Compression from './src/protocol/message/compression/index.ts';
import ResourceTypes from './src/protocol/resourceTypes.ts';
import ConfigResourceTypes from './src/protocol/configResourceTypes.ts';
import ConfigSource from './src/protocol/configSource.ts';
import AclResourceTypes from './src/protocol/aclResourceTypes.ts';
import AclOperationTypes from './src/protocol/aclOperationTypes.ts';
import AclPermissionTypes from './src/protocol/aclPermissionTypes.ts';
import ResourcePatternTypes from './src/protocol/resourcePatternTypes.ts';
import { LEVELS } from './src/loggers/index.ts';

const logLevel = LEVELS;
const CompressionTypes = Compression.Types;
const CompressionCodecs = Compression.Codecs;
const PartitionAssigners = roundRobin;

export {
  Kafka,
  PartitionAssigners,
  AssignerProtocol,
  Partitioners,
  logLevel,
  CompressionTypes,
  CompressionCodecs,
  /**
   * @deprecated
   * @see https://github.com/tulios/kafkajs/issues/649
   *
   * Use ConfigResourceTypes or AclResourceTypes instead.
   */
  ResourceTypes,
  ConfigResourceTypes,
  AclResourceTypes,
  AclOperationTypes,
  AclPermissionTypes,
  ResourcePatternTypes,
  ConfigSource,
};
