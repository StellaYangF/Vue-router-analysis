import install from './install';

export default class VueRouter {
  constructor(options= {}) {
    this.options = options;
  }
}
VueRouter.install = install;