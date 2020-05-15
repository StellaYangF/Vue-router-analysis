export let _Vue;
export default function install (Vue) {
  if (_Vue && install.installed) return;
  install.installed = true;
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        console.log(this.$options.name);
      } else {
        // console.log(this.$options.name);
      }
    },
  })
}