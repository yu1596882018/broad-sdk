// 用来记录浏览器历史记录的插件，搭配vue框架使用
// TODO:timestamp唯一（暂不处理location.hash = '1'/暂不考虑hash变化时的情况<原生>）、replace进入（暂不处理：后退一级，跳转）、vuex store
// 副作用：锚点会受影响，同一个锚点点击多次，会累加记录(只有router-link to="#3"的方式有这个现象，原生方式正常)
// 暂时只考虑了history模式，hash模式待验证
export default {
    install(Vue, { router }) {
        const placeholderHistory = {
            name: null,
            meta: {},
            path: 'null',
            hash: '',
            query: {},
            params: {},
            fullPath: 'null',
            matched: [],
        };

        // 判断首次加载
        function judgmentFirstLoad(from) {
            const { fullPath, hash, matched, meta, name, params, path, query } = from;
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

        // 追加补齐记录
        function completeRecord(fullHistoryTrack, newLength, to) {
            for (let i = 1; i <= newLength; i++) {
                if (i === newLength) {
                    // 记录当前路由
                    fullHistoryTrack.push(to);
                } else {
                    // 记录中间未知访问
                    fullHistoryTrack.push(placeholderHistory);
                }
            }

            return fullHistoryTrack;
        }

        router.currentHistoryTrack = JSON.parse(sessionStorage.getItem('currentHistoryTrack')) || []; // 基于当前历史记录，只包含前
        router.fullHistoryTrack = JSON.parse(sessionStorage.getItem('fullHistoryTrack')) || []; // 全部历史记录，包含前后
        let popstateFullPath = null;

        // 保存sessionStorage
        function saveHistoryTrack() {
            sessionStorage.setItem(
                'currentHistoryTrack',
                JSON.stringify(
                    router.currentHistoryTrack.map((item) => {
                        return {
                            ...item,
                            matched: [],
                        };
                    }),
                ),
            );

            // 矫正
            if (history.length !== router.fullHistoryTrack.length) {
                console.warn('saveHistoryTrack 矫正情况', history.length, router.fullHistoryTrack.length);

                // 备用矫正参考数据
                /* if (saveHistoryTrack.__backupsfullHistoryTrack) {
                  var backupsfullHistoryTrack = JSON.parse(saveHistoryTrack.__backupsfullHistoryTrack);
                } */

                if (history.length > router.fullHistoryTrack.length) {
                    const newLength = history.length - router.fullHistoryTrack.length;
                    for (let i = 1; i <= newLength; i++) {
                        router.fullHistoryTrack.unshift(placeholderHistory);
                    }
                } else if (history.length < router.fullHistoryTrack.length) {
                    const newLength = router.fullHistoryTrack.length - history.length;
                    for (let i = 1; i <= newLength; i++) {
                        router.fullHistoryTrack.shift();
                    }
                }
            }

            const newFullHistoryTrack = router.fullHistoryTrack.map((item) => {
                return {
                    ...item,
                    matched: [],
                };
            });

            saveHistoryTrack.__backupsfullHistoryTrack = JSON.stringify(newFullHistoryTrack);
            sessionStorage.setItem('fullHistoryTrack', saveHistoryTrack.__backupsfullHistoryTrack);
        }

        // 刷新/首次进入
        function init(currentRoute) {
            const historyLength = history.length;

            // 新增加打开访问时
            if (historyLength > router.fullHistoryTrack.length) {
                const newLength = historyLength - router.fullHistoryTrack.length;
                completeRecord(router.fullHistoryTrack, newLength, currentRoute);

                router.currentHistoryTrack = router.fullHistoryTrack.slice(0);

                // 刷新/replace进入/后退进入
            } else if (historyLength === router.fullHistoryTrack.length) {
                const targetIndex = router.fullHistoryTrack.findIndex(
                    (item) => item.fullPath === currentRoute.fullPath,
                );
                judgeReplaceRoute(currentRoute, targetIndex);
                // 后退再访问，历史记录减少时
            } else {
                router.fullHistoryTrack.splice(historyLength - 1);
                router.fullHistoryTrack.push(currentRoute);

                router.currentHistoryTrack = router.fullHistoryTrack.slice(0);
            }

            saveHistoryTrack();
        }

        // 判断前进
        function judgeForward(to, targetIndex) {
            // 前提保证唯一，否则会取最后一位
            if (
                targetIndex !== -1 &&
                targetIndex > router.currentHistoryTrack.length - 1 &&
                popstateFullPath === to.fullPath &&
                history.length === router.fullHistoryTrack.length
            ) {
                router.currentHistoryTrack = router.fullHistoryTrack.slice(0, targetIndex + 1);

                return true;
            }
        }

        // 判断后退
        function judgeBack(to, targetIndex) {
            // 前提保证唯一，否则会取最后一位
            if (
                targetIndex !== -1 &&
                targetIndex < router.currentHistoryTrack.length - 1 &&
                popstateFullPath === to.fullPath &&
                history.length === router.fullHistoryTrack.length
            ) {
                router.currentHistoryTrack = router.fullHistoryTrack.slice(0, targetIndex + 1);

                return true;
            }
        }

        // 判断replace新路由
        function judgeReplaceRoute(to, targetIndex) {
            if (history.length === router.fullHistoryTrack.length && popstateFullPath !== to.fullPath) {
                // new逻辑，前提保证唯一
                if (targetIndex !== -1) {
                    // 刷新
                    router.currentHistoryTrack = router.fullHistoryTrack.slice(0, targetIndex + 1);
                } else {
                    // replace进入（暂不处理：后退一级，跳转），满足唯一逻辑可忽略
                    router.currentHistoryTrack.pop();
                    router.currentHistoryTrack.push(to);
                    router.fullHistoryTrack.splice(router.currentHistoryTrack.length - 1, 1, to);
                }

                return true;
            }
        }

        // 判断跳转新路由
        function judgeNewRoute(to, targetIndex) {
            /* console.log(
              'judgeNewRoute',
              history.length,
              router.fullHistoryTrack.length,
              router.currentHistoryTrack.length,
            ); */
            if (
                targetIndex === -1 ||
                // 处理跳转新路由与历史路由完全一样的情况
                history.length > router.fullHistoryTrack.length ||
                // 处理后退再跳转新路由的情况
                history.length > router.currentHistoryTrack.length ||
                history.length < router.currentHistoryTrack.length
            ) {
                if (history.length > router.fullHistoryTrack.length) {
                    const newLength = history.length - router.fullHistoryTrack.length;
                    completeRecord(router.fullHistoryTrack, newLength, to);
                } else if (history.length > router.currentHistoryTrack.length) {
                    const newLength = history.length - router.currentHistoryTrack.length;
                    router.fullHistoryTrack = completeRecord(router.currentHistoryTrack, newLength, to);
                } else if (history.length < router.currentHistoryTrack.length) {
                    router.fullHistoryTrack = [
                        ...router.currentHistoryTrack.slice(0, history.length - 1),
                        to,
                    ];
                } else {
                    handleTheUnknown();
                }
            } else {
                handleTheUnknown();
            }

            function handleTheUnknown() {
                // 可能是后退第一页时，马上被重定向到第二页，此时history.length === router.currentHistoryTrack.length
                console.warn('judgeNewRoute 未知情况');

                const newHistoryTrack = router.fullHistoryTrack;
                const differenceLength = history.length - router.fullHistoryTrack.length - 1;
                if (differenceLength > 0) {
                    for (let i = 1; i <= differenceLength; i++) {
                        newHistoryTrack.push(placeholderHistory);
                    }
                } else if (differenceLength < 0) {
                    newHistoryTrack.splice(history.length - 1);
                }

                newHistoryTrack.push(to);
            }

            router.currentHistoryTrack = router.fullHistoryTrack.slice(0);

            return true;
        }

        router.beforeEach((to, from, next) => {
            // 没有标识时，加上再跳转
            // debugger;
            if (!to.query.timestamp) {
                const routeWithTimestamp = {
                    ...to,
                    query: {
                        ...to.query,
                        timestamp: String(Date.now()),
                    },
                };

                next(routeWithTimestamp);
            } else {
                const targetIndex = router.fullHistoryTrack.findLastIndex((item) => {
                    return item.query.timestamp === to.query.timestamp;
                });

                if (targetIndex !== -1) {
                    if (
                        // 不是当前页面刷新
                        // 暂不处理location.hash = '1';
                        to.fullPath !== location.href.replace(location.origin, '') &&
                        // 不是前进/后退
                        !router.fullHistoryTrack.some((item) => {
                            // popstateFullPath暂不考虑hash变化时的情况（解决思路，判断to和form是否只有hash不同）
                            return item.fullPath === popstateFullPath;
                        })
                    ) {
                        to.query.timestamp = String(Date.now());
                        return next(to);
                    }

                    next();
                } else {
                    next();
                }
            }
        });

        router.afterEach((to, from) => {
            // 首次加载
            if (judgmentFirstLoad(from)) {
                setTimeout(() => {
                    init(to);
                }, 1000);
            } else {
                const targetIndex = router.fullHistoryTrack.findLastIndex((item) => {
                    return item.fullPath === to.fullPath;
                });

                judgeForward(to, targetIndex) ||
                judgeBack(to, targetIndex) ||
                judgeReplaceRoute(to, targetIndex) ||
                judgeNewRoute(to, targetIndex);

                popstateFullPath = null;
                saveHistoryTrack();
                // console.log('afterEach', router.currentHistoryTrack, router.fullHistoryTrack);
                // debugger;
            }
        });

        window.addEventListener('popstate', () => {
            // debugger;
            popstateFullPath = location.href.replace(location.origin, '');
            // console.log('popstate', popstateFullPath);
        });
    },
};
