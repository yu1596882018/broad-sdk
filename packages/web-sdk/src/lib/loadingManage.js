/**
 * 请求 Loading 管理器
 * 支持多个并发请求的 loading 显示与隐藏，防止闪烁
 *
 * @param {Object} requestOptions - 配置项
 * @param {boolean} [requestOptions.openLoading=true] - 是否开启 loading
 * @param {Function} requestOptions.showLoading - 显示 loading 的回调
 * @param {Function} requestOptions.hideLoading - 隐藏 loading 的回调
 * @returns {Function} 结束 loading 的函数
 */
let requestLoadingCount = 0

export default function loadingManage(requestOptions = {}) {
  const options = {
    openLoading: true,
    ...requestOptions
  }

  let showLoading = false
  let loadingTimer = null

  if (options.openLoading) {
    loadingTimer = setTimeout(() => {
      showLoading = true
      requestLoadingCount++
      if (typeof options.showLoading === 'function') {
        options.showLoading()
      }
    }, 300) // 防止闪烁，延迟显示 loading
  }

  // 返回关闭 loading 的函数
  return function hideLoadingFn() {
    clearTimeout(loadingTimer)
    if (showLoading) {
      requestLoadingCount--
      if (requestLoadingCount <= 0) {
        setTimeout(() => {
          if (requestLoadingCount <= 0 && typeof options.hideLoading === 'function') {
            options.hideLoading()
          }
        }, 500) // 延迟隐藏，防止频繁闪烁
      }
    }
  }
}
