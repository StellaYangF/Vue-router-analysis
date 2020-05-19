import install from './install';
import { createMatcher } from './create-matcher';
import { HashHistory } from './history/hash';
import { HTML5History } from './history/html5';

class VueRouter {
  constructor(options = {}) {
    this.app = null;
    this.options = options;
    this.matcher = createMatcher(options.routes || [], this);

    let mode = options.mode || 'hash';
    this.mode = mode;
    this.beforeEaches = [];

    switch(mode) {
      case 'history':
        this.history = new HTML5History(this);
        break;
      case 'hash':
        this.history = new HashHistory(this, options.base);
        break;
      default:
        console.assert(false, `invalid mode: ${mode}`)
    }
  }

  push(location) {
    this.history.transitionTo(location, () => window.location.hash = location)
  }

  match(location) {
    return this.matcher.match(location); // { path, matched: [ record ] }
  }

  init(app) {
    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListener()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => app._route = route)
  }

  beforeEach(cb) {
    this.beforeEaches.push(cb);
  }
}

VueRouter.install = install;

export default VueRouter;