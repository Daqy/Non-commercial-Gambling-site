export function routerPathPrettify(path: string) {
  return path.split('/')[1].replace('-', ' ')
}
