/**
 * 页面监控
 */
const pagePerformance = {
  getTiming() {
    try {
      if (!window.performance || !window.performance.timing) {
        console.log('你的浏览器不支持 performance 操作')
        return
      }
      const t = window.performance.timing
      const times = {}
      const loadTime = t.loadEventEnd - t.loadEventStart
      if (loadTime < 0) {
        setTimeout(function () {
          pagePerformance.getTiming()
        }, 200)
        return
      }
      //【重要】重定向的时间
      times.redirectTime = (t.redirectEnd - t.redirectStart).toFixed(2) - 0
      //【重要】DNS 查询时间
      //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
      times.dnsTime = (t.domainLookupEnd - t.domainLookupStart).toFixed(2) - 0
      //【重要】读取页面第一个字节的时间
      //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
      times.ttfbTime = (t.responseStart - t.navigationStart).toFixed(2) - 0
      //DNS 缓存时间
      times.appcacheTime = (t.domainLookupStart - t.fetchStart).toFixed(2) - 0
      //卸载页面的时间
      times.unloadTime = (t.unloadEventEnd - t.unloadEventStart).toFixed(2) - 0
      //tcp连接耗时
      times.tcpTime = (t.connectEnd - t.connectStart).toFixed(2) - 0
      //【重要】内容加载完成的时间
      //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
      times.reqTime = (t.responseEnd - t.responseStart).toFixed(2) - 0
      //解析dom树耗时
      times.analysisTime = (t.domComplete - t.domInteractive).toFixed(2) - 0
      //白屏时间
      times.blankTime = (t.domLoading - t.navigationStart).toFixed(2) - 0
      //domReadyTime
      times.domReadyTime = (t.domContentLoadedEventEnd - t.navigationStart).toFixed(2) - 0
      //【重要】页面加载完成的时间
      //【原因】这几乎代表了用户等待页面可用的时间
      times.loadPageTime = (t.loadEventEnd - t.navigationStart).toFixed(2) - 0

      return times
    } catch (e) {
      console.log(e)
    }
  },

  getEntries(usefulType) {
    usefulType = usefulType || []
    if (!window.performance || !window.performance.getEntries) {
      console.log('该浏览器不支持performance.getEntries方法')
      return
    }
    const entryTimesList = []
    const entryList = window.performance.getEntries()
    if (!entryList || entryList.length == 0) {
      return entryTimesList
    }
    entryList.forEach((item, index) => {
      const templeObj = {}
      if (usefulType.indexOf(item.initiatorType) > -1) {
        //请求资源路径
        if (/data:/.test(item.name)) {
          // 处理base64加载
          templeObj.name = item.name.slice(0, 20)
        } else {
          templeObj.name = item.name
        }
        //发起资源类型
        templeObj.initiatorType = item.initiatorType
        //http协议版本
        templeObj.nextHopProtocol = item.nextHopProtocol
        //重定向时间
        templeObj.redirectTime = (item.redirectEnd - item.redirectStart).toFixed(2) - 0
        //dns查询耗时
        templeObj.dnsTime = (item.domainLookupEnd - item.domainLookupStart).toFixed(2) - 0
        //tcp链接耗时
        templeObj.tcpTime = (item.connectEnd - item.connectStart).toFixed(2) - 0
        //发送请求到接收到响应第一个字符
        templeObj.ttfbTime = (item.responseStart - item.requestStart).toFixed(2) - 0
        //接收响应的时间（从第一个字符到最后一个字符）
        templeObj.responseTime = (item.responseEnd - item.responseStart).toFixed(2) - 0
        //请求+响应总时间
        templeObj.reqTotalTime = (item.responseEnd - item.requestStart).toFixed(2) - 0
        entryTimesList.push(templeObj)
      }
    })
    return entryTimesList
  },
}

export default pagePerformance
