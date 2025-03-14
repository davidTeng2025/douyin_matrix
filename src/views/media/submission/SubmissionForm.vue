<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" class="!w-700px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="账号ID" prop="accountId">
        <el-select v-model="formData.accountId" placeholder="请选择">
          <el-option
            v-for="item in accountList"
            :key="item.accountId"
            :label="item.accountDesc"
            :value="item.accountId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入title" />
      </el-form-item>
      <el-form-item label="话题" prop="tag">
        <el-input v-model="formData.tag" placeholder="请输入tag" />
      </el-form-item>
      <el-form-item label="视频路径" prop="videoPath">
        <el-input v-model="formData.videoPath" placeholder="请输入视频路径" readonly />
      </el-form-item>
      <el-form-item label="视频路径" prop="imagePath">
        <el-input v-model="formData.imagePath" placeholder="请输入封面路径" readonly />
      </el-form-item>
      <!-- 选择可用视频 -->
      <el-row>
        <el-col :span="9" class="col-content">
          <div class="col-header">视频展示</div>
          <div class="video-container">
            <video :src="videoSrc" playsinline controls ref="videoElement"></video>
          </div>
        </el-col>
        <el-col :span="9" class="col-content">
          <div class="col-header">封面展示</div>
          <el-image style="width: 200px; object-fit: contain" :src="cover_url" />
        </el-col>
        <el-col :span="6" class="col-content">
          <div class="col-header">视频选择</div>
          <div class="video-panel-right">
            <div class="list-btn-div">
              <div
                v-for="(v, index) in videoList"
                :key="index"
                :class="['video-box', { selected: selectedItem === index }]"
                @click="selectVideo(v, index)"
              >
                <el-image fit="contain" :src="v.cover_url" radius="5px" />
                <div class="text-overlay">
                  <span class="ellipsis-text" style="--ellipsis-max-width: 80px"></span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="mt5">
        <el-form-item label="发布时间" prop="title">
          <el-radio-group v-model="formData.status" class="ml8 mr5">
            <el-radio value="0"> 立即发布 </el-radio>
            <el-radio value="1"> 定时发布 </el-radio>
          </el-radio-group>
          <el-date-picker
            v-model="formData.publishTime"
            value-format="YYYY-MM-DD HH:mm"
            type="datetime"
            placeholder="选择日期时间"
            class="!w-220px"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SubmissionApi, SubmissionVO } from '@/api/media/submission'
import { sleep } from '@/utils/myutils'
import { AccountApi } from '@/api/media/account'
import { SubmissionApiABP } from '@/api/media/submission/indexABP'
import { createDyOpenSchema } from '@/utils/dyOpenUtil'

/** 媒体投稿 表单 */
defineOptions({ name: 'SubmissionForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  accountId: undefined,
  title: undefined,
  videoPath: undefined,
  imagePath: undefined,
  status: undefined,
  publishBy: undefined,
  publishTime: undefined,
  tag: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

//视频播放组件
const videoElement = ref()

//视频成品列表
// 定义 Video 类型
interface Video {
  line_video_url: string
  cover_url: string
}
const videoList = ref<Video[]>([])
//选中视频的在videoList中的索引index
const selectedItem = ref(0)
//视频URL
const videoSrc = ref('')
//封面URL
const cover_url = ref('')
//账号选择列表
const accountList = ref<{ accountId: string; accountDesc: string }[]>([])
//控制二维码窗口
const dialogVisibleQR = ref(false)
//schema数据
const schema = ref('')
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await getAccountList()
  await getVideo()
  await selectVideo(videoList.value[0], 0)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SubmissionApi.getSubmission(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as SubmissionVO
    if (formType.value === 'create') {
      const schemaData = await SubmissionApi.createSubmission(data)
      dialogVisibleQR.value = true
      schema.value = createDyOpenSchema(schemaData)
      message.success(t('common.createSuccess'))
    } else {
      message.warning('暂时不支持修改')
      return
      await SubmissionApi.updateSubmission(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', schema.value)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    accountId: undefined,
    title: undefined,
    videoPath: undefined,
    imagePath: undefined,
    status: undefined,
    publishBy: undefined,
    publishTime: undefined
  }
  formRef.value?.resetFields()
}

/** 获取视频列表 */
const getVideo = async () => {
  try {
    // 第一次 API 调用
    const weComAccountRes = await SubmissionApi.getWeComAccount()
    if (!weComAccountRes) {
      console.error('Error: getWeComAccount returned invalid data')
      return // 退出函数，不继续执行
    }

    // 第二次 API 调用
    const res = await SubmissionApiABP.getCompositeSameVideo({
      data: { emp_id: weComAccountRes.enterprise_user_id }
    })
    if (!res) {
      console.error('Error: getCompositeSameVideo returned invalid data')
      return // 退出函数，不继续执行
    }

    // 如果一切正常，更新 videoList
    videoList.value = res
  } catch (err) {
    console.error('An error occurred while fetching videos:', err)
    // 这里可以根据业务逻辑通知用户，或执行其他错误处理逻辑
  }
}

/** 点击视频列表中的某条视频 */
const selectVideo = async (v, index) => {
  // const result = url.match(/\/[^/]+\/[^/]+\/[^?]+\.mp4/);
  videoSrc.value = v.line_video_url
  cover_url.value = v.cover_url
  selectedItem.value = index
  formData.value.videoPath = v.line_video_url
  formData.value.imagePath = v.cover_url
  await sleep(1000)
  videoElement.value.play()
}
/** 查询媒体账号列表 */
const getAccountList = async () => {
  formLoading.value = true
  AccountApi.listAccount({ isEnable: 1 }).then((response) => {
    accountList.value = response.list
    formLoading.value = false
  })
}
</script>

<style>
.video-container {
  position: relative;
  width: 200px;
  /* 占据父容器的 100% 宽度 */
  aspect-ratio: 9 / 16;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.col-header {
  border-radius: 4px;
  background: #d3dce6;
  width: 90%;
  height: 37px;
  line-height: 37px;
  margin: 7px;
}

.col-content {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  flex-direction: column;
  /* 垂直排列 */
  text-align: center;
  /* 文字居中（可选） */
}

.video-panel-right {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  /* justify-content: center; */
}

/* 右侧  允许滚动 */
.list-btn-div {
  flex: 0 0 auto;
  max-height: calc(100% - 0px);
  /* max-height: 300px; */
  /* 确保剩余空间可滚动 */
  overflow-y: auto;
  -ms-overflow-style: none;
  /* Internet Explorer 和 Edge */
  scrollbar-width: none;
  /* Firefox */
  /* 内容区域滚动 */
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  /* flex-wrap: nowrap; */
}

.list-btn-div::-webkit-scrollbar {
  display: none;
  /* Webkit 浏览器 */
}

/* 右边的Video列表 */
.video-box {
  position: relative;
  background-color: black;
  width: 80px;
  height: 120px;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 10px;
  text-align: center;
  margin: 5px;
  overflow: hidden;
  /* 添加这个属性来隐藏超出 div 的内容 */
}

.video-box.selected {
  border: 2px solid #00c575;
}

.text-overlay {
  position: absolute;
  bottom: 1px;
  left: 0;
  width: 100%;
  color: white;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 0;
  font-size: 8px;
}
</style>
