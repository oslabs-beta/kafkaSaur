// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (a: any, b: any) => {
  const result = []
  const length = a.length
  let i = 0

  while (i < length) {
    if (b.indexOf(a[i]) === -1) {
      result.push(a[i])
    }
    i += 1
  }

  return result
}
