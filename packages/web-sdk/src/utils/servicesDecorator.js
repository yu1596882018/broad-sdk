/**
 * 接口缓存装饰器
 * 用于缓存方法的返回值，支持Promise和同步函数
 *
 * @example
 * class ApiService {
 *   @CacheData
 *   async getUserInfo(id) {
 *     return await fetch(`/api/user/${id}`)
 *   }
 * }
 *
 * // 清除缓存
 * api.getUserInfo.clearCache()
 */
export const CacheData = (target, prototypeKey, descriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    if (descriptor.value.cacheData) {
      return descriptor.value.cacheData;
    }
    const result = originalMethod.apply(this, args);
    descriptor.value.cacheData = result;
    descriptor.value.clearCache = () => {
      descriptor.value.cacheData = undefined;
    };
    if (result instanceof Promise) {
      result.catch(() => {
        descriptor.value.clearCache();
      });
    }
    return result;
  };
  return descriptor;
};
