function normalizeBase(base = '/') {
  // 确保以 / 开头
  if (base.charAt(0) !== '/') base = '/' + base;
  // 移除末尾 /
  return base.replace(/\/$/, '');
}

const START = {
  name: null,
  meta: {},
  path: '/',
  hash: '',
  query: {},
  params: {},
  fullPath: '/',
  matched: []
}

export class History {
  constructor(router, base) {
    this.router = router;
    this.base = normalizeBase(base);
    this.current = START;
  }

  listen(cb) {
    this.cb = cb;
  }

  transitionTo(location, onComplete, onAbort) {
    let route = this.router.match(location, this.current);
  }
}