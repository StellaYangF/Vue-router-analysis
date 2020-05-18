import install from './install';
import { HashHistory } from './history/hash';
import { HTML5History } from './history/html5';

let VueRouter = function VueRouter(options = {}) {
    this.app = null;
    this.options = options;
    this.matcher = createMatcher(options.routes || [], this);

    let mode = options.mode || 'hash';
    this.mode = mode;

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

VueRouter.install = install;

export default VueRouter;