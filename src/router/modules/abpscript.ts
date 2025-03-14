// src/router/modules/abpscript.ts
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/Layout.vue'

const AbpscriptRoutes: RouteRecordRaw = {
  path: '/abpscript',
  component: Layout,
  meta: {
    title: '数字人应用'
  },
  children: [
    {
      path: 'CompositeVideo',
      component: () => import('@/views/abpscript/CompositeVideo/index.vue'),
      name: 'AbpCompositeVideo',
      meta: {
        title: '视频合成',
        icon: 'example'
      }
    },
    {
      path: 'CompositeSameResult',
      component: () => import('@/views/abpscript/CompositeSameResult/index.vue'),
      name: 'CompositeSameResult',
      meta: {
        title: '视频成片库',
        icon: 'example'
      }
    }
  ]
}

export default AbpscriptRoutes