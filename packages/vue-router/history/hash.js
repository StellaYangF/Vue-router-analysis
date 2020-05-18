import { History } from './base';

function ensureSlash() {
  if (window.location.hash) return;
  window.location.hash = '/';
}

export class HashHistory extends History{
  constructor(router) {
    super(router);
    ensureSlash();
  }

  getCurrentLocation() {
    return window.location.hash.slice(1);
  }
}

