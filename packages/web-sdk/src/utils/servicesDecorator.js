// 接口缓存装饰器
export const CacheData = (target, prototypeKey, descriptor) => {
  const oldValue = descriptor.value

  descriptor.value = function (...args) {
    if (descriptor.value.cacheData) {
      return descriptor.value.cacheData
    }

    const result = oldValue.apply(this, args)
    descriptor.value.cacheData = result
    descriptor.value.clearCache = () => {
      descriptor.value.cacheData = undefined
    }

    if (result instanceof Promise) {
      result.catch(() => {
        descriptor.value.clearCache()
      })
    }

    return result
  }
}
