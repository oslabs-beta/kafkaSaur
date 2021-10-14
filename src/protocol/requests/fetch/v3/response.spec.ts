// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'decode'.
const { decode, parse } = require('../v1/response')

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Requests > Fetch > v3', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response', async () => {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
    const data = await decode(Buffer.from(require('../fixtures/v3_response.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      responses: [
        {
          topicName: 'test-topic-131c279f35eeb2df6bc7',
          partitions: [
            {
              partition: 0,
              errorCode: 0,
              highWatermark: '3',
              messages: [
                {
                  offset: '0',
                  size: 39,
                  crc: -815808405,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1509827715172',
                  // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Buffer'. Did you mean 'buffer'?
                  key: Buffer.from('key-0'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-0'),
                },
                {
                  offset: '1',
                  size: 39,
                  crc: -656171735,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1509827715173',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-1'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-1'),
                },
                {
                  offset: '2',
                  size: 39,
                  crc: 309368599,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1509827715173',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-2'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-2'),
                },
              ],
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('response with GZIP', async () => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const data = await decode(Buffer.from(require('../fixtures/v3_response_gzip.json')))
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(data).toEqual({
      throttleTime: 0,
      responses: [
        {
          topicName: 'test-topic-7d48c01ed48f0667672b',
          partitions: [
            {
              partition: 0,
              errorCode: 0,
              highWatermark: '3',
              messages: [
                {
                  offset: '0',
                  size: 39,
                  crc: -822662985,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1509827715533',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-0'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-0'),
                },
                {
                  offset: '1',
                  size: 39,
                  crc: -872333670,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1509827715534',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-1'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-1'),
                },
                {
                  offset: '2',
                  size: 39,
                  crc: 110245028,
                  magicByte: 1,
                  attributes: 0,
                  timestamp: '1509827715534',
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  key: Buffer.from('key-2'),
                  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
                  value: Buffer.from('some-value-2'),
                },
              ],
            },
          ],
        },
      ],
    })

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(parse(data)).resolves.toBeTruthy()
  })
})
