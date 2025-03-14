import type { App } from 'vue'
import 'vant/lib/index.css'

// 导入 Vant 样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

export const setupVant = (app: App<Element>) => {
  // 这里不需要全局注册组件，因为我们在各个组件中按需导入
} 