// 主入口文件 - 统一导出所有功能模块

// 监控相关
export { MonitorJS } from './lib/monitor'

// 路由追踪
export { default as historyTrack } from './lib/historyTrack'

// 加载管理
export { default as loadingManage } from './lib/loadingManage'

// 响应式布局
export { default as flexible } from './lib/flexible'

// 工具函数
export { CacheData } from './utils/servicesDecorator'

// 样式文件
import './style/resetMobile.scss'
import './style/resetPc.scss'
import './style/mixins.scss'

// 默认导出MonitorJS作为主要功能
import MonitorJS from './lib/monitor/monitorjs'
export default MonitorJS 