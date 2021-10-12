/** @format */
import createProducer from './index.ts';
import Compression from '../protocol/message/compression';
import { KafkaJSNotImplemented } from '../errors.ts';

import { secureRandom, 
  createTopic, createModPartitioner, 
  connectionOpts, 
  newLogger, 
  createCluster } from 'testHelpers';

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Producer', () => {
  let topicName: any, cluster, producer: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async () => {
    topicName = `test-topic-${secureRandom()}`;
    await createTopic({ topic: topicName });

    cluster = createCluster({
      ...connectionOpts(),
      createPartitioner: createModPartitioner,
    });
    producer = createProducer({ cluster, logger: newLogger() });
    await producer.connect();
  });

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async () => {
    producer && (await producer.disconnect());
  });

  const codecsUsingExternalLibraries = [
    { name: 'snappy', codec: Compression.Types.Snappy },
    { name: 'lz4', codec: Compression.Types.LZ4 },
    { name: 'zstd', codec: Compression.Types.ZSTD },
  ];

  for (const entry of codecsUsingExternalLibraries) {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`${entry.name} compression not configured`, () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async () => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        await expect(
          producer.send({
            topic: topicName,
            compression: entry.codec,
            messages: [{ key: secureRandom(), value: secureRandom() }],
          })
        ).rejects.toThrow(KafkaJSNotImplemented);
      });
    });
  }
});
