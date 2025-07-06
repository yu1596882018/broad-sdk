// Vue.js 使用示例
import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  MonitorJS,
  historyTrack,
  loadingManage,
  CacheData,
} from '@yu1596882018/web-sdk';

// 使用 Vue Router
Vue.use(VueRouter);

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: {
      template: '<div><h1>首页</h1><p>这是首页内容</p></div>',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: {
      template: '<div><h1>关于</h1><p>这是关于页面</p></div>',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: {
      template: '<div><h1>联系</h1><p>这是联系页面</p></div>',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// 安装历史记录追踪插件
Vue.use(historyTrack, { router });

// 创建 Vue 实例
const app = new Vue({
  router,
  data() {
    return {
      loading: false,
      userData: null,
    };
  },
  methods: {
    // 使用加载管理
    async fetchUserData() {
      const hideLoading = loadingManage({
        openLoading: true,
        showLoading: () => {
          this.loading = true;
          console.log('显示加载状态');
        },
        hideLoading: () => {
          this.loading = false;
          console.log('隐藏加载状态');
        },
      });

      try {
        // 模拟 API 请求
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.userData = { id: 1, name: '张三', email: 'zhangsan@example.com' };
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        hideLoading();
      }
    },

    // 测试路由追踪
    showHistoryTrack() {
      console.log('当前历史记录:', this.$router.currentHistoryTrack);
      console.log('完整历史记录:', this.$router.fullHistoryTrack);
    },

    // 测试错误监控
    testError() {
      throw new Error('这是一个测试错误');
    },
  },
  mounted() {
    // 初始化监控
    MonitorJS.init({
      url: 'https://api.example.com/error-report',
      jsError: true,
      promiseError: true,
      resourceError: true,
      ajaxError: true,
      consoleError: true,
      vueError: true,
      vue: this,
      extendsInfo: {
        userId: 'vue-demo-user',
        version: '1.0.0',
        framework: 'vue',
      },
    });

    // 性能监控
    MonitorJS.monitorPerformance({
      pageId: 'vue-demo',
      url: 'https://api.example.com/performance-report',
    });

    console.log('Vue 应用已启动，监控系统已初始化');
  },
  template: `
    <div id="app">
      <nav>
        <router-link to="/">首页</router-link> |
        <router-link to="/about">关于</router-link> |
        <router-link to="/contact">联系</router-link>
      </nav>

      <div v-if="loading" style="color: blue;">加载中...</div>

      <router-view></router-view>

      <div style="margin-top: 20px;">
        <button @click="fetchUserData">获取用户数据</button>
        <button @click="showHistoryTrack">查看路由历史</button>
        <button @click="testError" style="color: red;">测试错误</button>
      </div>

      <div v-if="userData" style="margin-top: 20px; padding: 10px; background: #f0f0f0;">
        <h3>用户数据:</h3>
        <p>ID: {{ userData.id }}</p>
        <p>姓名: {{ userData.name }}</p>
        <p>邮箱: {{ userData.email }}</p>
      </div>
    </div>
  `,
});

// 挂载应用
app.$mount('#app');

// 导出供其他模块使用
export default app;
