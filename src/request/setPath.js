export const setPath = (req, path = '/') =>
  Object.defineProperty(req, 'path', {
    configurable: true,
    value: path
  })
