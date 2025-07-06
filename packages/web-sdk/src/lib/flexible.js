/**
 * 移动端自适应布局（rem 适配）
 * 最大宽度750px，最小宽度320px，1rem = 1/7.5 屏幕宽度
 * 支持0.5px发丝线检测
 */
(function flexible(window, document) {
  const maxWidth = 750 // 最大宽度
  const minWidth = 320 // 最小宽度
  const docEl = document.documentElement
  const dpr = window.devicePixelRatio || 1

  // 设置body字体大小，适配高清屏
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + 'px'
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  // setBodyFontSize() // 如需全局字体大小适配可打开

  // 设置根元素rem单位
  function setRemUnit() {
    let clientWidth = docEl.clientWidth
    if (clientWidth > maxWidth) clientWidth = maxWidth
    if (clientWidth < minWidth) clientWidth = minWidth
    const rem = clientWidth / 7.5
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 页面尺寸变化时重设rem
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 检测0.5px支持，添加hairlines类
  if (dpr >= 2) {
    const fakeBody = document.createElement('body')
    const testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
