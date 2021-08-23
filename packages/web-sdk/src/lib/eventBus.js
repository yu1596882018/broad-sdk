export default {
  install(Vue) {
    const EventBus = new Vue()
    Vue.prototype.$EventBus = EventBus
  },
}
