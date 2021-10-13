export default (timeInMs: any) => new Promise((resolve: any) => {
  setTimeout(resolve, timeInMs)
})
