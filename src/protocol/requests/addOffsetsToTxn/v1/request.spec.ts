/** @format */

import RequestV1Protocol from './request.ts';

describe('Protocol > Requests > AddOffsetsToTxn > v1', () => {
  test('request', async () => {
    const { buffer } = await RequestV1Protocol({
      transactionalId: 'test-transactional-id',
      producerId: '1001',
      producerEpoch: 0,
      groupId: 'foobar',
    }).encode();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v0_request.json')));
  });
});
