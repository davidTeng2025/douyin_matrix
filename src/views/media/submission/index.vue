<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="投稿ID" prop="submissionId">
        <el-input
          v-model="queryParams.submissionId"
          placeholder="请输入投稿ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="账号ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入账号ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="视频路径" prop="videoPath">
        <el-input
          v-model="queryParams.videoPath"
          placeholder="请输入视频路径"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="封面路径" prop="imagePath">
        <el-input
          v-model="queryParams.imagePath"
          placeholder="请输入封面路径"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEDIA_SUBMISSION_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布者" prop="publishBy">
        <el-input
          v-model="queryParams.publishBy"
          placeholder="请输入发布者"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="queryParams.publishTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" /> 搜索 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> 重置 </el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['media:submission:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['media:submission:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="primary"
          plain
          @click="postSubmission()"
          v-hasPermi="['media:submission:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 批量模拟导入
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="投稿ID" align="center" prop="submissionId" />
      <el-table-column label="账号ID" align="center" prop="accountId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="视频路径" align="center" prop="videoPath" />
      <el-table-column label="封面路径" align="center" prop="imagePath" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="发布者" align="center" prop="publishBy" />
      <el-table-column
        label="发布时间"
        align="center"
        prop="publishTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['media:submission:update']"
            :disabled="true"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['media:submission:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <SubmissionForm ref="formRef" @success="successFromSubmission" />

  <!-- 二维码弹窗 -->
  <SchemaQR ref="schemaRef" :schema="schema"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { SubmissionApi, SubmissionVO } from '@/api/media/submission'
import SubmissionForm from './SubmissionForm.vue'
import SchemaQR from './SchemaQR.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** 媒体投稿 列表 */
defineOptions({ name: 'Submission' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<SubmissionVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  submissionId: undefined,
  accountId: undefined,
  title: undefined,
  videoPath: undefined,
  imagePath: undefined,
  status: undefined,
  publishBy: undefined,
  publishTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const schema = ref('') //二维码信息
const schemaRef = ref() //二维码窗口

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SubmissionApi.getSubmissionPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SubmissionApi.deleteSubmission(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SubmissionApi.exportSubmission(queryParams)
    download.excel(data, '媒体投稿.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 模拟批量导入 */
const postSubmission = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm('是否模拟批量导入?')
    // 发起导出
    exportLoading.value = true
    await SubmissionApi.postSubmission('DY001')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

const successFromSubmission = async (schemaData) => {
  await getList()
  schema.value = schemaData
  schemaRef.value.open()
}
</script>
