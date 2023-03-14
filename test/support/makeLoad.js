export const makeLoad = (ms) => {
  const end = Date.now() + ms
  while (Date.now() < end) {
    let i = 0
    while (i < 1e5) {
      i++
    }
  }
}
