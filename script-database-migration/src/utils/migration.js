
exports.imageUrl = url => {
  if (url.startsWith('/assets')) {
    return url.replace(/^\/assets\//g, '/static/')
  }
  return url;
}