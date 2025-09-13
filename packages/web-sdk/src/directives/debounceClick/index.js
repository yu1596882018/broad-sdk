// click事件防抖指令
import { debounce } from '@/utils/index.js'

export default {
  mounted(el, binding) {
    const { value: callback, arg: delay = 500 } = binding

    if (typeof callback !== 'function') {
      console.warn('v-debounce-click 绑定的值必须是一个函数')
      return
    }

    el.addEventListener('click', debounce(callback, delay, true))
  },

  unmounted(el) {
    el.removeEventListener('click')
  },
}
