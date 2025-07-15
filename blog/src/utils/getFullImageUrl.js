export const getFullImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith('/media')
    ? `http://127.0.0.1:8000${path}`
    : path;
}; 