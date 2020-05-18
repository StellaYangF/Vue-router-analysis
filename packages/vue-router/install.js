import View from './components/router-view';
import Link from './components/router-link';

let Vue;

export default function install(_Vue) {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
    }
  })

  // dynamic property
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);
};
