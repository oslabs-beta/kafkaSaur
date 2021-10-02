export default async (array: any, groupFn: any) => {
  const result = new Map()

  for (const item of array) {
    const group = await Promise.resolve(groupFn(item))
    result.set(group, result.has(group) ? [...result.get(group), item] : [item])
  }

  return result
}
