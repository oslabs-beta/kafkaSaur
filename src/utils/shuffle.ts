/**
 * @param {T[]} array
 * @returns T[]
 * @template T
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (array: any) => {
  if (!Array.isArray(array)) {
    throw new TypeError("'array' is not an array")
  }

  if (array.length < 2) {
    return array
  }

  const copy = array.slice()

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }

  return copy
}
