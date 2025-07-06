// TypeScript 类型定义文件

// MonitorJS 配置接口
export interface MonitorOptions {
  url?: string;
  jsError?: boolean;
  promiseError?: boolean;
  resourceError?: boolean;
  ajaxError?: boolean;
  consoleError?: boolean;
  vueError?: boolean;
  vue?: any;
  extendsInfo?: Record<string, any>;
}

// 性能监控配置接口
export interface PerformanceOptions {
  pageId?: string;
  url?: string;
}

// 加载管理配置接口
export interface LoadingOptions {
  openLoading?: boolean;
  showLoading?: () => void;
  hideLoading?: () => void;
}

// 路由对象接口
export interface RouteObject {
  name: string | null;
  meta: Record<string, any>;
  path: string;
  hash: string;
  query: Record<string, any>;
  params: Record<string, any>;
  fullPath: string;
  matched: any[];
}

// 扩展的路由器接口
export interface ExtendedRouter {
  currentHistoryTrack: RouteObject[];
  fullHistoryTrack: RouteObject[];
}

// MonitorJS 类
export class MonitorJS {
  constructor();
  init(options?: MonitorOptions): void;
  monitorPerformance(options?: PerformanceOptions): void;
}

// 加载管理函数类型
export type LoadingManager = (options?: LoadingOptions) => () => void;

// 历史记录追踪插件类型
export interface HistoryTrackPlugin {
  install(Vue: any, options: { router: ExtendedRouter }): void;
}

// 响应式布局函数类型
export type FlexibleFunction = () => void;

// 缓存装饰器类型
export type CacheDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

// 默认导出
declare const MonitorJS: MonitorJS;
export default MonitorJS;

// 命名导出
export declare const loadingManage: LoadingManager;
export declare const historyTrack: HistoryTrackPlugin;
export declare const flexible: FlexibleFunction;
export declare const CacheData: CacheDecorator;
