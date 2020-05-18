export class History {
  constructor(router) {
    this.router = router;
    this.current = createRoute(null, { path: '/' }); // { path, matched: [ record ] }
  }

  listen(cb) {
    this.cb = cb;
  }

  transitionTo(location, onComplete) {
    let record = this.router.match(location, this.current);
    // { path, matched: [record] }
    if (location == this.current.path && record.matched.length == this.current.matched.length) {
      return;
    }
    onComplete && onComplete();

    let queue = this.router.beforeEaches || [];
    const iterator = (hook, next) => hook(record, this.current, next);
    runQueue(queue, iterator, () => this.updateRoute(record));
  }

  updateRoute(record) {
    this.current = record;
    this.cb && this.cb(record);
  }

  setupListener() {
    window.addEventListener('hashchange', () => this.transitionTo(window.location.hash.slice(1)));
  }

}

// record: { path, component, parent }
// path: { path }
export function createRoute(record, pathOption) {
  let matched = [];
  if (record) {
    while (record) {
      matched.unshift(record);
      record = record.parent;
    }
  }
  return {
    ...pathOption,
    matched,
  };
}

function runQueue(queue, iterator, callback) {
  function step(index) {
    if (index === queue.length) return callback();
    let hook = queue[index];
    iterator(hook, ()=> step(index+1));
  }
  step(0)
}