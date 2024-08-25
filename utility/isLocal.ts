const local =
  typeof window !== 'undefined' &&
  !!window.location.hostname.match('localhost') &&
  !!window.location.port

export default local
