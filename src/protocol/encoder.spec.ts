/** @format */

import Long from '../utils/long.ts';

import { Encoder } from './encoder.ts';
import { Decoder } from './decoder.ts';

const MAX_SAFE_POSITIVE_SIGNED_INT = 2147483647;
const MIN_SAFE_NEGATIVE_SIGNED_INT = -2147483648;

const MAX_SAFE_UNSIGNED_INT = 4294967295;
const MIN_SAFE_UNSIGNED_INT = 0;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Protocol > Encoder', () => {
  const signed32 = (number: any) => new Encoder().writeVarInt(number).buffer;
  const decode32 = (buffer: any) => new Decoder(buffer).readVarInt();

  const unsigned32 = (number: any) => new Encoder().writeUVarInt(number).buffer;
  const decode32u = (buffer: any) => new Decoder(buffer).readUVarInt();

  const signed64 = (number: any) => new Encoder().writeVarLong(number).buffer;
  const decode64 = (buffer: any) => new Decoder(buffer).readVarLong();

  const encodeDouble = (number: any) =>
    new Encoder().writeDouble(number).buffer;
  const decodeDouble = (buffer: any) => new Decoder(buffer).readDouble();

  const ustring = (string: any) =>
    new Encoder().writeUVarIntString(string).buffer;
  const decodeUString = (buffer: any) =>
    new Decoder(buffer).readUVarIntString();

  const ubytes = (bytes: any) => new Encoder().writeUVarIntBytes(bytes).buffer;
  const decodeUBytes = (buffer: any) => new Decoder(buffer).readUVarIntBytes();

  const uarray = (array: any) => new Encoder().writeUVarIntArray(array).buffer;

  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
  const B = (...args: any[]) => Buffer.from(args);
  const L = (value: any) => Long.fromString(`${value}`);

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Unsigned VarInt Array', () => {
    const encodeUVarInt = (number: any) => new Encoder().writeUVarInt(number);
    const array = [7681, 823, 9123, 9812, 3219];
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode uvarint array', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(uarray(array.map(encodeUVarInt))).toEqual(
        B(0x06, 0x81, 0x3c, 0xb7, 0x06, 0xa3, 0x47, 0xd4, 0x4c, 0x93, 0x19)
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode uvarint array', () => {
      const decodeUVarInt = (decoder: any) => decoder.readUVarInt();
      const encodedArray = uarray(array.map(encodeUVarInt));
      const decoder = new Decoder(encodedArray);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decoder.readUVarIntArray(decodeUVarInt)).toEqual(array);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Unsigned VarInt Bytes', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode uvarint bytes', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(ubytes(null)).toEqual(B(0x00));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(ubytes('')).toEqual(B(0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(ubytes('kafkajs')).toEqual(
        B(0x08, 0x6b, 0x61, 0x66, 0x6b, 0x61, 0x6a, 0x73)
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode uvarint bytes', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeUBytes(ubytes(null))).toEqual(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeUBytes(ubytes(''))).toEqual(B());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeUBytes(ubytes('kafkajs'))).toEqual(
        B(0x6b, 0x61, 0x66, 0x6b, 0x61, 0x6a, 0x73)
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Unsigned VarInt String', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode uvarint string', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(ustring(null)).toEqual(B(0x00));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(ustring('')).toEqual(B(0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(ustring('kafkajs')).toEqual(
        B(0x08, 0x6b, 0x61, 0x66, 0x6b, 0x61, 0x6a, 0x73)
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode uvarint string', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeUString(ustring(null))).toEqual(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeUString(ustring(''))).toEqual('');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeUString(ustring('kafkajs'))).toEqual('kafkajs');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('writeEncoder', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if the value is not an Encoder', () => {
      const encoder = new Encoder();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => encoder.writeEncoder()).toThrow(
        'value should be an instance of Encoder'
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should append the value buffer to the existing encoder', () => {
      const encoder = new Encoder()
        .writeBuffer(B(1))
        .writeEncoder(new Encoder().writeBuffer(B(2)));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encoder.buffer).toEqual(B(1, 2));
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('writeEncoderArray', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if any of the elements in the array are not encoders', () => {
      const values = [new Encoder(), 'not an encoder'];
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => new Encoder().writeEncoderArray(values)).toThrow(
        'all values should be an instance of Encoder[]'
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should append all encoder values to the existing encoder', () => {
      const values = [
        new Encoder().writeBuffer(B(1)),
        new Encoder().writeBuffer(B(2)),
        new Encoder().writeBuffer(B(3)),
      ];

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(new Encoder().writeEncoderArray(values).buffer).toEqual(
        B(1, 2, 3)
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('double', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode double', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(-3.1415926535897932)).toEqual(
        B(0xc0, 0x09, 0x21, 0xfb, 0x54, 0x44, 0x2d, 0x18)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(-0.3333333333333333)).toEqual(
        B(0xbf, 0xd5, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(-59.82946381)).toEqual(
        B(0xc0, 0x4d, 0xea, 0x2b, 0xde, 0xc0, 0x95, 0x31)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(-1.5)).toEqual(
        B(0xbf, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(0.0)).toEqual(
        B(0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(1.5)).toEqual(
        B(0x3f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(59.82946381)).toEqual(
        B(0x40, 0x4d, 0xea, 0x2b, 0xde, 0xc0, 0x95, 0x31)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(0.3333333333333333)).toEqual(
        B(0x3f, 0xd5, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encodeDouble(3.1415926535897932)).toEqual(
        B(0x40, 0x09, 0x21, 0xfb, 0x54, 0x44, 0x2d, 0x18)
      );
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode double', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(-3.1415926535897932))).toEqual(
        -3.1415926535897932
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(-0.3333333333333333))).toEqual(
        -0.3333333333333333
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(-59.82946381))).toEqual(-59.82946381);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(-1.5))).toEqual(-1.5);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(0.0))).toEqual(0.0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(1.5))).toEqual(1.5);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(59.82946381))).toEqual(59.82946381);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(0.3333333333333333))).toEqual(
        0.3333333333333333
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decodeDouble(encodeDouble(3.1415926535897932))).toEqual(
        3.1415926535897932
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('varint', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode signed int32 numbers', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(0)).toEqual(B(0x00));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(1)).toEqual(B(0x02));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(63)).toEqual(B(0x7e));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(64)).toEqual(B(0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(8191)).toEqual(B(0xfe, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(8192)).toEqual(B(0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(1048575)).toEqual(B(0xfe, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(1048576)).toEqual(B(0x80, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(134217727)).toEqual(B(0xfe, 0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(134217728)).toEqual(B(0x80, 0x80, 0x80, 0x80, 0x01));

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-1)).toEqual(B(0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-64)).toEqual(B(0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-65)).toEqual(B(0x81, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-8192)).toEqual(B(0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-8193)).toEqual(B(0x81, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-1048576)).toEqual(B(0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-1048577)).toEqual(B(0x81, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-134217728)).toEqual(B(0xff, 0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(-134217729)).toEqual(B(0x81, 0x80, 0x80, 0x80, 0x01));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode signed int32 boundaries', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(MAX_SAFE_POSITIVE_SIGNED_INT)).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0x0f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed32(MIN_SAFE_NEGATIVE_SIGNED_INT)).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0x0f)
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode signed int32 numbers', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(0))).toEqual(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(1))).toEqual(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(63))).toEqual(63);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(64))).toEqual(64);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(8191))).toEqual(8191);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(8192))).toEqual(8192);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(1048575))).toEqual(1048575);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(1048576))).toEqual(1048576);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(134217727))).toEqual(134217727);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(134217728))).toEqual(134217728);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-1))).toEqual(-1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-64))).toEqual(-64);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-65))).toEqual(-65);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-8192))).toEqual(-8192);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-8193))).toEqual(-8193);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-1048576))).toEqual(-1048576);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-1048577))).toEqual(-1048577);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-134217728))).toEqual(-134217728);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(-134217729))).toEqual(-134217729);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode signed int32 boundaries', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(MAX_SAFE_POSITIVE_SIGNED_INT))).toEqual(
        MAX_SAFE_POSITIVE_SIGNED_INT
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32(signed32(MIN_SAFE_NEGATIVE_SIGNED_INT))).toEqual(
        MIN_SAFE_NEGATIVE_SIGNED_INT
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('uvarint', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode unsigned int32 numbers', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(0)).toEqual(B(0x00));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(1)).toEqual(B(0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(127)).toEqual(B(0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(128)).toEqual(B(0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(8192)).toEqual(B(0x80, 0x40));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(16383)).toEqual(B(0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(16384)).toEqual(B(0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(2097151)).toEqual(B(0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(2097152)).toEqual(B(0x80, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(134217728)).toEqual(B(0x80, 0x80, 0x80, 0x40));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(268435455)).toEqual(B(0xff, 0xff, 0xff, 0x7f));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode unsigned int32 boundaries', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(MAX_SAFE_UNSIGNED_INT)).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0x0f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(unsigned32(MIN_SAFE_UNSIGNED_INT)).toEqual(B(0x00));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode unsigned int32 numbers', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(0))).toEqual(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(1))).toEqual(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(127))).toEqual(127);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(128))).toEqual(128);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(8192))).toEqual(8192);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(16383))).toEqual(16383);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(16384))).toEqual(16384);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(2097151))).toEqual(2097151);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(134217728))).toEqual(134217728);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(268435455))).toEqual(268435455);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode unsigned int32 boundaries', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => decode32u(B(0xff, 0xff, 0xff, 0xff, 0xff, 0x01))).toThrow();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(MAX_SAFE_UNSIGNED_INT))).toEqual(
        MAX_SAFE_UNSIGNED_INT
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode32u(unsigned32(MIN_SAFE_UNSIGNED_INT))).toEqual(
        MIN_SAFE_UNSIGNED_INT
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('varlong', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('encode signed int64 number', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(0)).toEqual(B(0x00));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(1)).toEqual(B(0x02));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(63)).toEqual(B(0x7e));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(64)).toEqual(B(0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(8191)).toEqual(B(0xfe, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(8192)).toEqual(B(0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(1048575)).toEqual(B(0xfe, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(1048576)).toEqual(B(0x80, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(134217727)).toEqual(B(0xfe, 0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(134217728)).toEqual(B(0x80, 0x80, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(MAX_SAFE_POSITIVE_SIGNED_INT)).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0x0f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('17179869183'))).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('17179869184'))).toEqual(
        B(0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('2199023255551'))).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('2199023255552'))).toEqual(
        B(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('281474976710655'))).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('281474976710656'))).toEqual(
        B(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('36028797018963967'))).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('36028797018963968'))).toEqual(
        B(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('4611686018427387903'))).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('4611686018427387904'))).toEqual(
        B(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(Long.MAX_VALUE)).toEqual(
        B(0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01)
      );

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-1)).toEqual(B(0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-64)).toEqual(B(0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-65)).toEqual(B(0x81, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-8192)).toEqual(B(0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-8193)).toEqual(B(0x81, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-1048576)).toEqual(B(0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-1048577)).toEqual(B(0x81, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-134217728)).toEqual(B(0xff, 0xff, 0xff, 0x7f));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(-134217729)).toEqual(B(0x81, 0x80, 0x80, 0x80, 0x01));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(MIN_SAFE_NEGATIVE_SIGNED_INT)).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0x0f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-17179869184'))).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-17179869185'))).toEqual(
        B(0x81, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-2199023255552'))).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-2199023255553'))).toEqual(
        B(0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-281474976710656'))).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-281474976710657'))).toEqual(
        B(0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 1)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-36028797018963968'))).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-36028797018963969'))).toEqual(
        B(0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-4611686018427387904'))).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(L('-4611686018427387905'))).toEqual(
        B(0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(signed64(Long.MIN_VALUE)).toEqual(
        B(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01)
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('decode signed int64 number', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(0))).toEqual(L(0));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(1))).toEqual(L(1));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(63))).toEqual(L(63));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(64))).toEqual(L(64));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(8191))).toEqual(L(8191));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(8192))).toEqual(L(8192));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(1048575))).toEqual(L(1048575));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(1048576))).toEqual(L(1048576));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(134217727))).toEqual(L(134217727));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(134217728))).toEqual(L(134217728));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(MAX_SAFE_POSITIVE_SIGNED_INT))).toEqual(
        L(MAX_SAFE_POSITIVE_SIGNED_INT)
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('17179869183')))).toEqual(L('17179869183'));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('17179869184')))).toEqual(L('17179869184'));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('2199023255551')))).toEqual(
        L('2199023255551')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('2199023255552')))).toEqual(
        L('2199023255552')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('281474976710655')))).toEqual(
        L('281474976710655')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('281474976710656')))).toEqual(
        L('281474976710656')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('36028797018963967')))).toEqual(
        L('36028797018963967')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('36028797018963968')))).toEqual(
        L('36028797018963968')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('4611686018427387903')))).toEqual(
        L('4611686018427387903')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(L('4611686018427387904')))).toEqual(
        L('4611686018427387904')
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(decode64(signed64(Long.MAX_VALUE))).toEqual(Long.MAX_VALUE);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() =>
        decode64(
          B(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01)
        )
      ).toThrow();
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('sizeOfVarInt', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the size in bytes', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(0)).toEqual(signed32(1).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(1)).toEqual(signed32(1).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(63)).toEqual(signed32(63).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(64)).toEqual(signed32(64).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(8191)).toEqual(signed32(8191).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(8192)).toEqual(signed32(8192).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(1048575)).toEqual(signed32(1048575).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(1048576)).toEqual(signed32(1048576).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(134217727)).toEqual(
        signed32(134217727).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(134217728)).toEqual(
        signed32(134217728).length
      );

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-1)).toEqual(signed32(-1).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-64)).toEqual(signed32(-64).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-65)).toEqual(signed32(-65).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-8192)).toEqual(signed32(-8192).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-8193)).toEqual(signed32(-8193).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-1048576)).toEqual(signed32(-1048576).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-1048577)).toEqual(signed32(-1048577).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-134217728)).toEqual(
        signed32(-134217728).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(-134217729)).toEqual(
        signed32(-134217729).length
      );

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(MAX_SAFE_POSITIVE_SIGNED_INT)).toEqual(
        signed32(MAX_SAFE_POSITIVE_SIGNED_INT).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarInt(MIN_SAFE_NEGATIVE_SIGNED_INT)).toEqual(
        signed32(MIN_SAFE_NEGATIVE_SIGNED_INT).length
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('sizeOfVarLong', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the size in bytes', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(0)).toEqual(signed64(0).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(1)).toEqual(signed64(1).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(63)).toEqual(signed64(63).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(64)).toEqual(signed64(64).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(8191)).toEqual(signed64(8191).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(8192)).toEqual(signed64(8192).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(1048575)).toEqual(signed64(1048575).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(1048576)).toEqual(signed64(1048576).length);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(134217727)).toEqual(
        signed64(134217727).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(134217728)).toEqual(
        signed64(134217728).length
      );

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(MAX_SAFE_POSITIVE_SIGNED_INT)).toEqual(
        signed64(MAX_SAFE_POSITIVE_SIGNED_INT).length
      );

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('17179869183'))).toEqual(
        signed64(L('17179869183')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('17179869184'))).toEqual(
        signed64(L('17179869184')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('2199023255551'))).toEqual(
        signed64(L('2199023255551')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('2199023255552'))).toEqual(
        signed64(L('2199023255552')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('281474976710655'))).toEqual(
        signed64(L('281474976710655')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('281474976710656'))).toEqual(
        signed64(L('281474976710656')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('-36028797018963968'))).toEqual(
        signed64(L('-36028797018963968')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('-36028797018963969'))).toEqual(
        signed64(L('-36028797018963969')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('-4611686018427387904'))).toEqual(
        signed64(L('-4611686018427387904')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(L('-4611686018427387905'))).toEqual(
        signed64(L('-4611686018427387905')).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(Long.MIN_VALUE)).toEqual(
        signed64(Long.MIN_VALUE).length
      );
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Encoder.sizeOfVarLong(Long.MAX_VALUE)).toEqual(
        signed64(Long.MAX_VALUE).length
      );
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('resizing', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('copies existing content when resizing', () => {
      const encoder = new Encoder(4);
      encoder.writeBuffer(B(1, 2, 3, 4));
      encoder.writeBuffer(B(5, 6, 7, 8));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encoder.buffer).toEqual(B(1, 2, 3, 4, 5, 6, 7, 8));
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('obeys offset when resizing', () => {
      const encoder = new Encoder(4);
      // Only two bytes in, ...
      encoder.writeBuffer(B(1, 2));
      // ... but this write will require resizing
      encoder.writeBuffer(B(5, 6, 7, 8));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(encoder.buffer).toEqual(B(1, 2, 5, 6, 7, 8));
    });
  });
});
