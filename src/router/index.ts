import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import remainingRouter from './modules/remaining'
// 直接导入abpscript路由
import AbpscriptRoutes from './modules/abpscript'

// 创建路由实例 - 初始只包含系统路由
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH), // createWebHashHistory URL带#，createWebHistory URL不带#
  strict: true,
  routes: [
    ...remainingRouter as RouteRecordRaw[],
    AbpscriptRoutes as RouteRecordRaw, // 直接添加到初始路由中
    // EmployeeRoutes 将在setupRouter中动态添加
    {
      path: '/sbutree',
      name: 'SbuTree',
      component: () => import('@/components/SbuTree.vue'),
      meta: { title: '选择产品' }
    },
  ],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

// 动态添加路由
export const setupRouter = (app: App<Element>) => {
  // 不再需要动态导入abpscript路由，因为已经直接在上面添加了
  // import('./modules/abpscript').then((module) => {
  //   const AbpscriptRoutes = module.default;
  //   // 动态添加路由
  //   router.addRoute(AbpscriptRoutes);
  //   console.log('Employee routes added dynamically');
  // });
  
  app.use(router)
}

export default router
