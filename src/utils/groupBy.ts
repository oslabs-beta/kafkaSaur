// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
export async (array: any, groupFn: any) => {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
  const result = new Map()

  for (const item of array) {
    // @ts-expect-error ts-migrate(2585) FIXME: 'Promise' only refers to a type, but is being used... Remove this comment to see the full error message
    const group = await Promise.resolve(groupFn(item))
    result.set(group, result.has(group) ? [...result.get(group), item] : [item])
  }

  return result
}
