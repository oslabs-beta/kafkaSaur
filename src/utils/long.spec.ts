// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Long'.
import Long from './long'

const max = new Long(9223372036854775807n) // max signed int 64

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Utils > Long', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Converters', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fromString(str)', () => {
      const nativeOutput = Long.fromString('9007199254740991')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(nativeOutput).toEqual({ value: 9007199254740991n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof nativeOutput.value).toEqual('bigint')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('toString()', () => {
      const output = new Long(BigInt(10))
      const expectedString = output.toString()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(expectedString).toEqual('10')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof expectedString).toEqual('string')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fromNumber(value)', () => {
      // number
      const numberOutput = Long.fromNumber(12)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(numberOutput).toEqual({ value: 12n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof numberOutput.value).toEqual('bigint')

      // string
      const stringOutput = Long.fromNumber('12')
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(stringOutput).toEqual({ value: 12n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof stringOutput.value).toEqual('bigint')

      // Long
      const longOutput = new Long(BigInt(12))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(longOutput).toEqual({ value: 12n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof longOutput.value).toEqual('bigint')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fromValue(value)', () => {
      const output = Long.fromNumber(12)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(output).toEqual({ value: 12n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof output.value).toEqual('bigint')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fromInt(value)', () => {
      const output = Long.fromInt(12)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(output).toEqual({ value: 12n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof output.value).toEqual('bigint')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('toInt()', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an int', () => {
        const maxInt32 = 2 ** 31 - 1
        const expectedInt = new Long(BigInt(maxInt32)).toInt()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(expectedInt).toEqual(2147483647)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(typeof expectedInt).toEqual('number')
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should wrap around if the number is too big to be represented as an int32', () => {
        const maxInt32 = 2 ** 31 - 1
        const expectedInt = new Long(BigInt(maxInt32 + 1)).toInt()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(expectedInt).toEqual(-2147483648)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(typeof expectedInt).toEqual('number')
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('toNumber()', () => {
      const expectedNumber = max.toNumber()
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(expectedNumber).toEqual(9223372036854776000)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof expectedNumber).toEqual('number')
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Operators', () => {
    let input1: any, input2: any
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeAll'.
    beforeAll(() => {
      input1 = new Long(BigInt(5))
      input2 = new Long(BigInt(13))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Bitwise', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('AND', () => {
        const output = input1.and(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 5n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('OR', () => {
        const output = input1.or(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 13n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('XOR', () => {
        const output = input1.xor(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 8n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('NOT', () => {
        const output = input1.not()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: -6n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Left shift', () => {
        const output = input1.shiftLeft(1)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 10n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Right shift', () => {
        const output = input1.shiftRight(1)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 2n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Right shift unsigned', () => {
        const output = input1.shiftRightUnsigned(1)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 2n })
      })
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Others', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('ADD', () => {
        const output = input1.add(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: 18n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('subtract', () => {
        const output = input1.subtract(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: -8n })
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Equal', () => {
        const expectFalse = input1.equals(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(expectFalse).toEqual(false)

        const expectTrue = input1.equals(input1)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(expectTrue).toEqual(true)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Not equal', () => {
        const expectFalse = input1.notEquals(input2)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(expectFalse).toEqual(true)

        const expectTrue = input1.notEquals(input1)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(expectTrue).toEqual(false)
      })

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('NEGATE', () => {
        const output = input1.negate()
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(output).toEqual({ value: -5n })
      })
    })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Other functions', () => {
    let input1: any, input2: any
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeAll'.
    beforeAll(() => {
      input1 = new Long(BigInt(5))
      input2 = new Long(BigInt(13))
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('getHighBits() & getLowBits()', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.getHighBits()).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.getLowBits()).toEqual(5)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input2.getHighBits()).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input2.getLowBits()).toEqual(13)

      // 128
      const input = new Long(128n)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input.getHighBits()).toEqual(0)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(max.getLowBits()).toEqual(-1)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('isZero()', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.isZero()).toEqual(false)
      const zero = new Long(BigInt(0))
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(zero.isZero()).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('isNegative()', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(new Long(BigInt(-15)).isNegative()).toEqual(true)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(new Long(BigInt(2)).isNegative()).toEqual(false)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('multiply()', () => {
      const mult = input1.multiply(input2)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mult).toEqual({ value: 65n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof mult.value).toEqual('bigint')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('divide()', () => {
      const divide = input2.divide(input1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(divide).toEqual({ value: 2n })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(typeof divide.value).toEqual('bigint')
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('compare()', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input2.compare(input1)).toEqual(1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.compare(input2)).toEqual(-1)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.compare(input1)).toEqual(0)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('lessThan()', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input2.lessThan(input1)).toEqual(false)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.lessThan(input2)).toEqual(true)
    })

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('greaterThanOrEqual()', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.greaterThanOrEqual(input2)).toEqual(false)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input1.greaterThanOrEqual(input1)).toEqual(true)
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(input2.greaterThanOrEqual(input1)).toEqual(true)
    })
  })
})
