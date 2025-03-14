<template>
  <!-- 显示二维码的模态窗口 -->
  <el-dialog v-model="dialogVisibleQR" title="二维码生成" width="800px">
    <div style="text-align: center">
      <!-- 显示二维码 -->
      <qrcode :value="schema" :size="200" :level="'H'" />
      <p style="margin-top: 20px">您生成的二维码内容是：</p>
      <p
        ><b>{{ props.schema }}</b></p
      >
    </div>

    <!-- 模态窗口的操作按钮 -->
    <template #footer>
      <el-button @click="dialogVisibleQR = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Qrcode from '@chenfengyuan/vue-qrcode'

/** 媒体投稿 表单 */
defineOptions({ name: 'SchemaQR' })

// 定义 props 接收父组件数据
const props = defineProps({
  schema: String // 父组件传递的消息
})

//控制二维码窗口
const dialogVisibleQR = ref(false)

/** 打开弹窗 */
const open = async () => {
  dialogVisibleQR.value = true
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
