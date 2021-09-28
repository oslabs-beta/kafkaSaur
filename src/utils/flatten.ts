/**
 * Flatten the given arrays into a new array
 *
 * @param {Array<Array<T>>} arrays
 * @returns {Array<T>}
 * @template T
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'flatten'.
function flatten(arrays: any) {
  return [].concat.apply([], arrays)
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = flatten
