/**
 * Flatten the given arrays into a new array
 *
 * @param {Array<Array<T>>} arrays
 * @returns {Array<T>}
 * @template T
 */
function flatten(arrays: any) {
  return [].concat.apply([], arrays)
}

export default flatten
