/**
 * Vue Router 历史记录追踪插件
 * 用于记录和追踪用户在应用中的导航历史
 *
 * @author yu1596882018
 * @version 1.0.0
 */

/**
 * 占位符历史记录对象
 * @type {Object}
 */
const PLACEHOLDER_HISTORY = {
  name: null,
  meta: {},
  path: 'null',
  hash: '',
  query: {},
  params: {},
  fullPath: 'null',
  matched: [],
  timestamp: Date.now(),
};

/**
 * 历史记录追踪器类
 */
class HistoryTracker {
  /**
   * 创建历史记录追踪器
   * @param {Object} router - Vue Router 实例
   */
  constructor(router) {
    this.router = router;
    this.popstateFullPath = null;
    this.storageKey = {
      current: 'currentHistoryTrack',
      full: 'fullHistoryTrack',
    };

    // 初始化历史记录
    this.initializeHistory();
  }

  /**
   * 初始化历史记录
   * @private
   */
  initializeHistory() {
    try {
      this.router.currentHistoryTrack = this.loadFromStorage(this.storageKey.current) || [];
      this.router.fullHistoryTrack = this.loadFromStorage(this.storageKey.full) || [];
    } catch (error) {
      console.warn('[HistoryTracker] 初始化历史记录失败:', error);
      this.router.currentHistoryTrack = [];
      this.router.fullHistoryTrack = [];
    }
  }

  /**
   * 从 sessionStorage 加载数据
   * @param {string} key - 存储键名
   * @returns {Array} 历史记录数组
   * @private
   */
  loadFromStorage(key) {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`[HistoryTracker] 加载存储数据失败 (${key}):`, error);
      return [];
    }
  }

  /**
   * 保存数据到 sessionStorage
   * @param {string} key - 存储键名
   * @param {Array} data - 要保存的数据
   * @private
   */
  saveToStorage(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`[HistoryTracker] 保存数据失败 (${key}):`, error);
    }
  }

  /**
   * 判断是否为首次加载
   * @param {Object} route - 路由对象
   * @returns {boolean} 是否为首次加载
   * @private
   */
  isFirstLoad(route) {
    const { fullPath, hash, matched, meta, name, params, path, query } = route;
    return (
      fullPath === '/' &&
      hash === '' &&
      matched.length === 0 &&
      Object.keys(meta).length === 0 &&
      name === null &&
      Object.keys(params).length === 0 &&
      path === '/' &&
      Object.keys(query).length === 0
    );
  }

  /**
   * 创建路由记录对象
   * @param {Object} route - 路由对象
   * @returns {Object} 路由记录对象
   * @private
   */
  createRouteRecord(route) {
    return {
      ...route,
      timestamp: Date.now(),
      matched: [], // 清空 matched 数组以减小存储大小
    };
  }

  /**
   * 补齐历史记录
   * @param {Array} historyTrack - 历史记录数组
   * @param {number} newLength - 需要补齐的长度
   * @param {Object} currentRoute - 当前路由
   * @returns {Array} 补齐后的历史记录
   * @private
   */
  completeHistoryRecord(historyTrack, newLength, currentRoute) {
    const result = [...historyTrack];

    for (let i = 1; i <= newLength; i++) {
      if (i === newLength) {
        // 记录当前路由
        result.push(this.createRouteRecord(currentRoute));
      } else {
        // 记录中间未知访问
        result.push({ ...PLACEHOLDER_HISTORY, timestamp: Date.now() });
      }
    }

    return result;
  }

  /**
   * 保存历史记录到存储
   * @private
   */
  saveHistoryTrack() {
    try {
      // 保存当前历史记录
      const currentHistoryData = this.router.currentHistoryTrack.map(item => ({
        ...item,
        matched: [],
      }));
      this.saveToStorage(this.storageKey.current, currentHistoryData);

      // 矫正历史记录长度
      this.correctHistoryLength();

      // 保存完整历史记录
      const fullHistoryData = this.router.fullHistoryTrack.map(item => ({
        ...item,
        matched: [],
      }));
      this.saveToStorage(this.storageKey.full, fullHistoryData);
    } catch (error) {
      console.error('[HistoryTracker] 保存历史记录失败:', error);
    }
  }

  /**
   * 矫正历史记录长度
   * @private
   */
  correctHistoryLength() {
    const historyLength = history.length;
    const fullHistoryLength = this.router.fullHistoryTrack.length;

    if (historyLength !== fullHistoryLength) {
      console.warn('[HistoryTracker] 历史记录长度不匹配，进行矫正:', {
        historyLength,
        fullHistoryLength,
      });

      if (historyLength > fullHistoryLength) {
        // 历史记录增加，在前面补充占位符
        const newLength = historyLength - fullHistoryLength;
        for (let i = 1; i <= newLength; i++) {
          this.router.fullHistoryTrack.unshift({ ...PLACEHOLDER_HISTORY, timestamp: Date.now() });
        }
      } else if (historyLength < fullHistoryLength) {
        // 历史记录减少，移除前面的记录
        const removeLength = fullHistoryLength - historyLength;
        this.router.fullHistoryTrack.splice(0, removeLength);
      }
    }
  }

  /**
   * 初始化历史记录（刷新/首次进入）
   * @param {Object} currentRoute - 当前路由
   * @private
   */
  init(currentRoute) {
    const historyLength = history.length;

    if (historyLength > this.router.fullHistoryTrack.length) {
      // 新增加打开访问时
      const newLength = historyLength - this.router.fullHistoryTrack.length;
      this.router.fullHistoryTrack = this.completeHistoryRecord(
        this.router.fullHistoryTrack,
        newLength,
        currentRoute,
      );
      this.router.currentHistoryTrack = [...this.router.fullHistoryTrack];
    } else if (historyLength === this.router.fullHistoryTrack.length) {
      // 刷新/replace进入/后退进入
      const targetIndex = this.router.fullHistoryTrack.findIndex(
        item => item.fullPath === currentRoute.fullPath,
      );
      this.handleReplaceRoute(currentRoute, targetIndex);
    } else {
      // 后退再访问，历史记录减少时
      this.router.fullHistoryTrack.splice(historyLength - 1);
      this.router.fullHistoryTrack.push(this.createRouteRecord(currentRoute));
      this.router.currentHistoryTrack = [...this.router.fullHistoryTrack];
    }

    this.saveHistoryTrack();
  }

  /**
   * 处理前进操作
   * @param {Object} to - 目标路由
   * @param {number} targetIndex - 目标索引
   * @returns {boolean} 是否为前进操作
   * @private
   */
  handleForward(to, targetIndex) {
    if (
      targetIndex !== -1 &&
      targetIndex > this.router.currentHistoryTrack.length - 1 &&
      this.popstateFullPath === to.fullPath &&
      history.length === this.router.fullHistoryTrack.length
    ) {
      this.router.currentHistoryTrack = this.router.fullHistoryTrack.slice(0, targetIndex + 1);
      return true;
    }
    return false;
  }

  /**
   * 处理后退操作
   * @param {Object} to - 目标路由
   * @param {number} targetIndex - 目标索引
   * @returns {boolean} 是否为后退操作
   * @private
   */
  handleBack(to, targetIndex) {
    if (
      targetIndex !== -1 &&
      targetIndex < this.router.currentHistoryTrack.length - 1 &&
      this.popstateFullPath === to.fullPath &&
      history.length === this.router.fullHistoryTrack.length
    ) {
      this.router.currentHistoryTrack = this.router.fullHistoryTrack.slice(0, targetIndex + 1);
      return true;
    }
    return false;
  }

  /**
   * 处理替换路由操作
   * @param {Object} to - 目标路由
   * @param {number} targetIndex - 目标索引
   * @returns {boolean} 是否为替换操作
   * @private
   */
  handleReplaceRoute(to, targetIndex) {
    if (history.length === this.router.fullHistoryTrack.length && this.popstateFullPath !== to.fullPath) {
      if (targetIndex !== -1) {
        // 刷新
        this.router.currentHistoryTrack = this.router.fullHistoryTrack.slice(0, targetIndex + 1);
      } else {
        // replace进入
        this.router.currentHistoryTrack.pop();
        this.router.currentHistoryTrack.push(this.createRouteRecord(to));
        this.router.fullHistoryTrack.splice(this.router.currentHistoryTrack.length - 1, 1, this.createRouteRecord(to));
      }
      return true;
    }
    return false;
  }

  /**
   * 处理新路由跳转
   * @param {Object} to - 目标路由
   * @param {number} targetIndex - 目标索引
   * @private
   */
  handleNewRoute(to, targetIndex) {
    if (
      targetIndex === -1 ||
      history.length > this.router.fullHistoryTrack.length ||
      history.length > this.router.currentHistoryTrack.length ||
      history.length < this.router.currentHistoryTrack.length
    ) {
      if (history.length > this.router.fullHistoryTrack.length) {
        const newLength = history.length - this.router.fullHistoryTrack.length;
        this.router.fullHistoryTrack = this.completeHistoryRecord(
          this.router.fullHistoryTrack,
          newLength,
          to,
        );
      } else if (history.length > this.router.currentHistoryTrack.length) {
        const newLength = history.length - this.router.currentHistoryTrack.length;
        this.router.fullHistoryTrack = this.completeHistoryRecord(
          this.router.currentHistoryTrack,
          newLength,
          to,
        );
      } else if (history.length < this.router.currentHistoryTrack.length) {
        this.router.fullHistoryTrack = [
          ...this.router.currentHistoryTrack.slice(0, history.length - 1),
          this.createRouteRecord(to),
        ];
      }
    }
  }

  /**
   * 处理未知情况
   * @param {Object} to - 目标路由
   * @private
   */
  handleUnknown(to) {
    console.warn('[HistoryTracker] 遇到未知的路由变化情况:', {
      to: to.fullPath,
      historyLength: history.length,
      currentLength: this.router.currentHistoryTrack.length,
      fullLength: this.router.fullHistoryTrack.length,
    });

    // 重置为当前路由
    this.router.currentHistoryTrack = [this.createRouteRecord(to)];
    this.router.fullHistoryTrack = [this.createRouteRecord(to)];
  }

  /**
   * 处理路由变化
   * @param {Object} to - 目标路由
   * @param {Object} from - 来源路由
   * @private
   */
  handleRouteChange(to, from) {
    try {
      // 判断是否为首次加载
      if (this.isFirstLoad(from)) {
        this.init(to);
        return;
      }

      const targetIndex = this.router.fullHistoryTrack.findIndex(
        item => item.fullPath === to.fullPath,
      );

      // 尝试各种路由变化类型
      if (this.handleForward(to, targetIndex)) {
        console.log('[HistoryTracker] 检测到前进操作');
      } else if (this.handleBack(to, targetIndex)) {
        console.log('[HistoryTracker] 检测到后退操作');
      } else if (this.handleReplaceRoute(to, targetIndex)) {
        console.log('[HistoryTracker] 检测到替换操作');
      } else {
        this.handleNewRoute(to, targetIndex);
        console.log('[HistoryTracker] 检测到新路由跳转');
      }

      this.saveHistoryTrack();
    } catch (error) {
      console.error('[HistoryTracker] 处理路由变化失败:', error);
      this.handleUnknown(to);
    }
  }

  /**
   * 获取历史记录统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    return {
      currentLength: this.router.currentHistoryTrack.length,
      fullLength: this.router.fullHistoryTrack.length,
      uniquePaths: new Set(this.router.fullHistoryTrack.map(route => route.path)).size,
      totalTime: this.router.fullHistoryTrack.length > 0
        ? Date.now() - this.router.fullHistoryTrack[0].timestamp
        : 0,
    };
  }

  /**
   * 清理历史记录
   */
  clear() {
    this.router.currentHistoryTrack = [];
    this.router.fullHistoryTrack = [];
    sessionStorage.removeItem(this.storageKey.current);
    sessionStorage.removeItem(this.storageKey.full);
    console.log('[HistoryTracker] 历史记录已清理');
  }
}

/**
 * Vue 插件安装函数
 * @param {Object} Vue - Vue 构造函数
 * @param {Object} options - 插件选项
 * @param {Object} options.router - Vue Router 实例
 */
export default {
  install(Vue, { router }) {
    if (!router) {
      console.error('[HistoryTracker] 必须提供 router 实例');
      return;
    }

    // 创建历史记录追踪器
    const tracker = new HistoryTracker(router);

    // 监听路由变化
    router.beforeEach((to, from, next) => {
      tracker.handleRouteChange(to, from);
      next();
    });

    // 监听 popstate 事件
    window.addEventListener('popstate', () => {
      tracker.popstateFullPath = router.currentRoute.fullPath;
    });

    // 添加工具方法到 router 实例
    router.getHistoryStatistics = () => tracker.getStatistics();
    router.clearHistory = () => tracker.clear();

    console.log('[HistoryTracker] 历史记录追踪插件已安装');
  },
};
