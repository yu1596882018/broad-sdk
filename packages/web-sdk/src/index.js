/**
 * @yu1596882018/web-sdk
 * Web 前端 SDK 主入口文件
 *
 * @author yu1596882018 <1596882018@qq.com>
 * @license MIT
 */

// 监控模块
export { MonitorJS } from './lib/monitor'

// 工具模块
export { default as EventBus } from './lib/eventBus'
export { default as HistoryTrack } from './lib/historyTrack'
export { default as LoadingManage } from './lib/loadingManage'

// 样式（需要手动引入）
// import '@yu1596882018/web-sdk/src/style/resetMobile.scss'
// import '@yu1596882018/web-sdk/src/style/resetPc.scss'

// 默认导出
import { MonitorJS } from './lib/monitor'
export default MonitorJS



