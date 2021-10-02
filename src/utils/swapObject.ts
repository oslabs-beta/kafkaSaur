const { keys } = Object
export default (object: any) => keys(object).reduce((result, key) => ({ ...result, [object[key]]: key }), {})
