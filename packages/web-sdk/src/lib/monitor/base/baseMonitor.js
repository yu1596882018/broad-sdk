import { ErrorLevelEnum, ErrorCategoryEnum } from './baseConfig.js'
import DeviceInfo from '../device'
import API from './api.js'
import utils from '../utils/utils.js'
import TaskQueue from './taskQueue.js'

/**
 * 监控基类
 */
class BaseMonitor {
  /**
   * 上报错误地址
   * @param {*} params { reportUrl,extendsInfo }
   */
  constructor(params) {
    this.category = ErrorCategoryEnum.UNKNOW_ERROR //错误类型
    this.level = ErrorLevelEnum.INFO //错误等级
    this.msg = '' //错误信息
    this.url = '' //错误信息地址
    this.line = '' //行数
    this.col = '' //列数
    this.errorObj = '' //错误堆栈

    this.reportUrl = params.reportUrl //上报错误地址
    this.extendsInfo = params.extendsInfo //扩展信息
  }

  /**
   * 记录错误信息
   */
  recordError() {
    this.handleRecordError()
    //延迟记录日志
    setTimeout(() => {
      TaskQueue.isStop && TaskQueue.fire() //停止则fire
    }, 100)
  }

  /**
   * 处理记录日志
   */
  handleRecordError() {
    try {
      if (!this.msg) {
        return
      }
      //过滤掉错误上报地址
      if (this.reportUrl && this.url && this.url.toLowerCase().indexOf(this.reportUrl.toLowerCase()) >= 0) {
        console.log('统计错误接口异常', this.msg)
        return
      }
      const errorInfo = this.handleErrorInfo()

      console.log('\n````````````````````` ' + this.category + ' `````````````````````\n', errorInfo)

      //记录日志
      TaskQueue.add(this.reportUrl, errorInfo)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 处理错误信息
   * @param {*} extendsInfo
   */
  handleErrorInfo() {
    let txt = '错误类别: ' + this.category + '\r\n'
    txt += '日志信息: ' + this.msg + '\r\n'
    txt += 'url: ' + encodeURIComponent(this.url) + '\r\n'
    switch (this.category) {
      case ErrorCategoryEnum.JS_ERROR:
        txt += '错误行号: ' + this.line + '\r\n'
        txt += '错误列号: ' + this.col + '\r\n'
        if (this.errorObj && this.errorObj.stack) {
          txt += '错误栈: ' + this.errorObj.stack + '\r\n'
        }
        break
      default:
        txt += '其他错误: ' + JSON.stringify(this.errorObj) + '\r\n'
        break
    }
    const deviceInfo = this.getDeviceInfo()
    const extendsInfo = this.getExtendsInfo()
    const recordInfo = extendsInfo
    recordInfo.category = this.category //错误分类
    recordInfo.logType = this.level //错误级别
    recordInfo.logInfo = txt //错误信息
    recordInfo.deviceInfo = deviceInfo //设备信息
    // recordInfo.timestamp = new Date()
    return recordInfo
  }

  /**
   * 获取扩展信息
   */
  getExtendsInfo() {
    try {
      const ret = {}
      let extendsInfo = this.extendsInfo || {}
      let dynamicParams
      if (utils.isFunction(extendsInfo.getDynamic)) {
        dynamicParams = extendsInfo.getDynamic() //获取动态参数
      }
      //判断动态方法返回的参数是否是对象
      if (utils.isObject(dynamicParams)) {
        extendsInfo = { ...extendsInfo, ...dynamicParams }
      }
      //遍历扩展信息，排除动态方法
      for (const key in extendsInfo) {
        if (!utils.isFunction(extendsInfo[key])) {
          //排除获取动态方法
          ret[key] = extendsInfo[key]
        }
      }
      return ret
    } catch (error) {
      console.log('call getExtendsInfo error', error)
      return {}
    }
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo() {
    try {
      const deviceInfo = DeviceInfo.getDeviceInfo()
      return deviceInfo
    } catch (error) {
      console.log(error)
      return ''
    }
  }
}

export default BaseMonitor
