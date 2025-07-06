/**
 * 全局事件总线插件
 * 用于跨组件通信
 *
 * @example
 * // main.js
 * import EventBus from './eventBus'
 * Vue.use(EventBus)
 *
 * // 组件A
 * this.$EventBus.$emit('my-event', data)
 *
 * // 组件B
 * this.$EventBus.$on('my-event', handler)
 */
export default {
  install(Vue) {
    if (!Vue.prototype.$EventBus) {
      const EventBus = new Vue();
      Vue.prototype.$EventBus = EventBus;
    }
  },
};
