export default {
  name: "has",
  inserted(el, bindings, vnode) {
    const { expression } = bindings;
    console.log(vnode);
  },
}